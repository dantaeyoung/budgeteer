<script setup lang="ts">
import { ref } from 'vue'
import { useBudgetStore } from '@/stores/budget'

const budgetStore = useBudgetStore()

const amount = ref('')
const description = ref('')
const date = ref(new Date().toISOString().split('T')[0]) // Default to today's date in YYYY-MM-DD format

const submitTransaction = () => {
  if (!amount.value || !description.value || !date.value) return

  budgetStore.addTransaction({
    amount: parseFloat(amount.value),
    description: description.value,
    date: new Date(date.value).toISOString(), // Convert to ISO string for storage
  })

  // Reset form
  amount.value = ''
  description.value = ''
  date.value = new Date().toISOString().split('T')[0] // Reset to today
}
</script>

<template>
  <div class="transaction-entry p-4 bg-white rounded-lg shadow">
    <form @submit.prevent="submitTransaction" class="space-y-4">
      <div class="flex flex-col">
        <label for="date" class="text-sm font-medium text-gray-700">Date</label>
        <input
          id="date"
          v-model="date"
          type="date"
          class="mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div class="flex flex-col">
        <label for="amount" class="text-sm font-medium text-gray-700">Amount</label>
        <input
          id="amount"
          v-model="amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          class="mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div class="flex flex-col">
        <label for="description" class="text-sm font-medium text-gray-700">Description</label>
        <input
          id="description"
          v-model="description"
          type="text"
          placeholder="What did you spend on?"
          class="mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <button
        type="submit"
        class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
      >
        Add Transaction
      </button>
    </form>
  </div>
</template>

<style scoped>
.transaction-entry {
  max-width: 400px;
  margin: 0 auto;
}
</style>
