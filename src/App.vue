<script setup lang="ts">
import BudgetOverview from '@/components/BudgetOverview.vue'
import TransactionEntry from '@/components/TransactionEntry.vue'
import DropboxSettings from '@/components/DropboxSettings.vue'
</script>

<template>
  <header class="bg-blue-500 text-white py-4 mb-8">
    <div class="container mx-auto px-4">
      <h1 class="text-2xl font-bold">Budgeteer</h1>
    </div>
  </header>

  <main class="container mx-auto px-4">
    <div class="max-w-2xl mx-auto space-y-8">
      <div class="budget-section">
        <BudgetOverview />
      </div>

      <div class="entry-section">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Add Transaction</h2>
        <TransactionEntry />
      </div>

      <div class="settings-section">
        <DropboxSettings />
      </div>
    </div>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
