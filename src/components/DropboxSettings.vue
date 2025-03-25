<script setup lang="ts">
import { ref } from 'vue'
import { useBudgetStore } from '@/stores/budget'

const store = useBudgetStore()
const appKey = ref('')
const showAppKey = ref(false)

function connectDropbox() {
  if (appKey.value) {
    store.setDropboxAppKey(appKey.value)
    window.location.href = store.getDropboxAuthUrl()
  }
}

function disconnectDropbox() {
  if (
    confirm(
      'Are you sure you want to disconnect from Dropbox? Your data will remain in local storage.',
    )
  ) {
    store.disconnectDropbox()
  }
}
</script>

<template>
  <div class="dropbox-settings p-4 bg-white rounded-lg shadow-sm">
    <h2 class="text-xl font-semibold text-gray-800 mb-4">Dropbox Sync Settings</h2>

    <!-- Not Connected State -->
    <div v-if="!store.isAuthenticated" class="space-y-4">
      <div class="flex flex-col">
        <label for="app-key" class="text-sm font-medium text-gray-700 mb-1">Dropbox App Key</label>
        <div class="relative">
          <input
            :type="showAppKey ? 'text' : 'password'"
            id="app-key"
            v-model="appKey"
            placeholder="Enter your Dropbox app key"
            class="w-full p-2 pr-10 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <button
            @click="showAppKey = !showAppKey"
            type="button"
            class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {{ showAppKey ? '🙈' : '👁️' }}
          </button>
        </div>
        <p class="mt-1 text-sm text-gray-500">
          Get your app key from the
          <a
            href="https://www.dropbox.com/developers/apps"
            target="_blank"
            rel="noopener"
            class="text-blue-500 hover:text-blue-600"
            >Dropbox App Console</a
          >
        </p>
      </div>

      <button
        @click="connectDropbox"
        :disabled="!appKey"
        class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Connect to Dropbox
      </button>
    </div>

    <!-- Connected State -->
    <div v-else class="space-y-4">
      <div class="flex items-center space-x-2 text-green-600">
        <span class="text-xl">✓</span>
        <span>Connected to Dropbox</span>
      </div>

      <div v-if="store.lastSyncTime" class="text-sm text-gray-500">
        Last synced: {{ new Date(store.lastSyncTime).toLocaleString() }}
      </div>

      <button
        @click="disconnectDropbox"
        class="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
      >
        Disconnect from Dropbox
      </button>
    </div>
  </div>
</template>

<style scoped>
.dropbox-settings {
  max-width: 400px;
  margin: 0 auto;
}
</style>
