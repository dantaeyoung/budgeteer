import { Dropbox, DropboxResponse } from 'dropbox'
import type { files } from 'dropbox'

const DROPBOX_REDIRECT_URI = window.location.origin // This will be your app's URL
const BUDGET_FILE_PATH = '/budgeteer-data.json'

interface DropboxAuthResponse {
  result: {
    access_token: string
  }
}

// The actual response type from Dropbox includes more fields
interface DropboxFileMetadata extends files.FileMetadata {
  fileBlob: Blob
}

interface DropboxAuth {
  getAuthenticationUrl: (redirectUri: string) => string
  getAccessTokenFromCode: (redirectUri: string, code: string) => Promise<DropboxAuthResponse>
}

interface DropboxWithAuth extends Dropbox {
  auth: DropboxAuth
}

export class DropboxService {
  private dbx: Dropbox | null = null
  private accessToken: string | null = null
  private appKey: string | null = null

  constructor() {
    // Try to get existing tokens from localStorage
    this.accessToken = localStorage.getItem('dropbox_access_token')
    this.appKey = localStorage.getItem('dropbox_app_key')

    if (this.accessToken) {
      this.dbx = new Dropbox({ accessToken: this.accessToken })
    }
  }

  isAuthenticated(): boolean {
    return !!this.accessToken
  }

  hasAppKey(): boolean {
    return !!this.appKey
  }

  setAppKey(key: string): void {
    this.appKey = key
    localStorage.setItem('dropbox_app_key', key)
  }

  getAuthUrl(): string {
    if (!this.appKey) throw new Error('Dropbox App Key not set')
    const dbx = new Dropbox({ clientId: this.appKey }) as DropboxWithAuth
    return dbx.auth.getAuthenticationUrl(DROPBOX_REDIRECT_URI)
  }

  async handleRedirect(code: string): Promise<void> {
    if (!this.appKey) throw new Error('Dropbox App Key not set')
    const dbx = new Dropbox({ clientId: this.appKey }) as DropboxWithAuth
    const response = await dbx.auth.getAccessTokenFromCode(DROPBOX_REDIRECT_URI, code)
    if (response.result.access_token) {
      this.accessToken = response.result.access_token
      localStorage.setItem('dropbox_access_token', this.accessToken)
      this.dbx = new Dropbox({ accessToken: this.accessToken })
    }
  }

  async saveData(data: unknown): Promise<void> {
    if (!this.dbx) throw new Error('Not authenticated with Dropbox')

    try {
      // Convert data to JSON string
      const content = JSON.stringify(data, null, 2)

      // Upload to Dropbox
      await this.dbx.filesUpload({
        path: BUDGET_FILE_PATH,
        contents: content,
        mode: { '.tag': 'overwrite' },
      })
    } catch (error) {
      console.error('Failed to save to Dropbox:', error)
      throw error
    }
  }

  async loadData(): Promise<unknown> {
    if (!this.dbx) throw new Error('Not authenticated with Dropbox')

    try {
      // Download from Dropbox
      const response = (await this.dbx.filesDownload({
        path: BUDGET_FILE_PATH,
      })) as DropboxResponse<DropboxFileMetadata>

      // Read the file content
      const fileBlob = response.result.fileBlob
      const text = await new Response(fileBlob).text()

      // Parse JSON
      return JSON.parse(text)
    } catch (error) {
      if (error instanceof Error && 'status' in error && error.status === 409) {
        // File doesn't exist yet
        return null
      }
      console.error('Failed to load from Dropbox:', error)
      throw error
    }
  }

  disconnect(): void {
    localStorage.removeItem('dropbox_access_token')
    localStorage.removeItem('dropbox_app_key')
    this.accessToken = null
    this.appKey = null
    this.dbx = null
  }
}
