import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Transaction, DailyBudget, BudgetState } from '@/types/budget'
import { DropboxService } from '@/services/dropbox'

export const useBudgetStore = defineStore('budget', () => {
  const dropbox = new DropboxService()

  const dailyBudget = ref<DailyBudget>({
    amount: 50,
    currency: 'USD',
  })

  const transactions = ref<Transaction[]>([])
  const isLoading = ref(false)
  const lastSyncTime = ref<string | null>(null)
  const isAuthenticated = computed(() => dropbox.isAuthenticated())
  const hasDropboxKey = computed(() => dropbox.hasAppKey())

  // Get today's transactions
  const todaysTransactions = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return transactions.value.filter((t) => t.date.startsWith(today))
  })

  // Calculate remaining budget for today
  const remainingBudget = computed(() => {
    const spent = todaysTransactions.value.reduce((sum, t) => sum + t.amount, 0)
    return dailyBudget.value.amount - spent
  })

  // Add a new transaction
  async function addTransaction(transaction: Omit<Transaction, 'id'>) {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      date: transaction.date || new Date().toISOString(),
    }
    transactions.value.unshift(newTransaction)
    await saveToLocalStorage()
    if (isAuthenticated.value) {
      await syncToDropbox()
    }
  }

  // Update daily budget
  async function updateDailyBudget(amount: number) {
    dailyBudget.value.amount = amount
    await saveToLocalStorage()
    if (isAuthenticated.value) {
      await syncToDropbox()
    }
  }

  // Save to local storage
  async function saveToLocalStorage() {
    const state: BudgetState = {
      dailyBudget: dailyBudget.value,
      transactions: transactions.value,
      lastSync: new Date().toISOString(),
    }
    localStorage.setItem('budgeteer-state', JSON.stringify(state))
  }

  // Load from local storage
  async function loadFromLocalStorage() {
    const stored = localStorage.getItem('budgeteer-state')
    if (stored) {
      const state: BudgetState = JSON.parse(stored)
      dailyBudget.value = state.dailyBudget
      transactions.value = state.transactions
      lastSyncTime.value = state.lastSync ?? null
    }
  }

  // Sync to Dropbox
  async function syncToDropbox() {
    try {
      isLoading.value = true
      const state: BudgetState = {
        dailyBudget: dailyBudget.value,
        transactions: transactions.value,
        lastSync: new Date().toISOString(),
      }

      await dropbox.saveData(state)
      lastSyncTime.value = state.lastSync ?? null
    } catch (error) {
      console.error('Failed to sync with Dropbox:', error)
    } finally {
      isLoading.value = false
    }
  }

  // Load from Dropbox
  async function loadFromDropbox() {
    try {
      isLoading.value = true

      if (isAuthenticated.value) {
        const data = (await dropbox.loadData()) as BudgetState | null
        if (data) {
          dailyBudget.value = data.dailyBudget
          transactions.value = data.transactions
          lastSyncTime.value = data.lastSync ?? null
          await saveToLocalStorage() // Update local storage with Dropbox data
          return
        }
      }

      // Fall back to local storage if Dropbox fails or isn't authenticated
      await loadFromLocalStorage()
    } catch (error) {
      console.error('Failed to load from Dropbox:', error)
      await loadFromLocalStorage() // Fall back to local storage
    } finally {
      isLoading.value = false
    }
  }

  // Set Dropbox app key
  function setDropboxAppKey(key: string): void {
    dropbox.setAppKey(key)
  }

  // Get Dropbox auth URL
  function getDropboxAuthUrl(): string {
    return dropbox.getAuthUrl()
  }

  // Handle Dropbox auth redirect
  async function handleDropboxRedirect(code: string) {
    await dropbox.handleRedirect(code)
    await loadFromDropbox() // Load data after authentication
  }

  // Disconnect from Dropbox
  function disconnectDropbox() {
    dropbox.disconnect()
  }

  // Initialize
  loadFromDropbox() // Try to load from Dropbox first, then fall back to local storage

  return {
    dailyBudget,
    transactions,
    todaysTransactions,
    remainingBudget,
    isLoading,
    lastSyncTime,
    isAuthenticated,
    hasDropboxKey,
    addTransaction,
    updateDailyBudget,
    setDropboxAppKey,
    getDropboxAuthUrl,
    handleDropboxRedirect,
    disconnectDropbox,
  }
})
