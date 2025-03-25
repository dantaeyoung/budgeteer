<script setup lang="ts">
import { useBudgetStore } from '@/stores/budget'

const budgetStore = useBudgetStore()

// Format date to a more readable format
const formatDate = (isoDate: string) => {
  return new Date(isoDate).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>

<template>
  <div>
    <!-- Budget Summary -->
    <div class="budget-summary p-6 bg-white rounded-lg shadow-sm mb-8">
      <div class="text-center">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Today's Budget</h2>
        <div
          class="text-4xl font-bold mb-2"
          :class="{
            'text-red-500': budgetStore.remainingBudget < 0,
            'text-green-500': budgetStore.remainingBudget >= 0,
          }"
        >
          {{ budgetStore.dailyBudget.currency }} {{ budgetStore.remainingBudget.toFixed(2) }}
        </div>
        <div class="text-gray-500">
          remaining from {{ budgetStore.dailyBudget.currency }}
          {{ budgetStore.dailyBudget.amount.toFixed(2) }}
        </div>
      </div>
    </div>

    <!-- Transactions Table -->
    <div class="transactions-section mt-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">Today's Transactions</h3>
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <table class="w-full" v-if="budgetStore.todaysTransactions.length > 0">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-600">Description</th>
              <th class="text-right py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="transaction in budgetStore.todaysTransactions"
              :key="transaction.id"
              class="border-b border-gray-100 last:border-b-0"
            >
              <td class="py-3 px-4 text-sm text-gray-500">{{ formatDate(transaction.date) }}</td>
              <td class="py-3 px-4 text-sm text-gray-800">{{ transaction.description }}</td>
              <td class="py-3 px-4 text-sm text-right font-medium">
                {{ budgetStore.dailyBudget.currency }} {{ transaction.amount.toFixed(2) }}
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="text-center py-8 text-gray-500">No transactions today</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.budget-summary {
  max-width: 400px;
  margin: 0 auto;
}

.transactions-section {
  width: 100%;
}
</style>
