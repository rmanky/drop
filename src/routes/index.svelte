<script lang="ts">
  const links = [
    {
      name: "Drop",
      href: "/drop",
      color: "#1133BB"
    },
    {
      name: "Wordle",
      href: "/wordle",
      color: "#118833"
    }
  ]
</script>


<template>
  <div h-full flex items-center justify-center font-mono>
    <div>
      <h1 text-24 text-middle>rmanky</h1>
      <div flex flex-col gap-2 text-6 justify-start>
        {#each links as link}
          <div flex flex-row>
            <a ml-2 w="1/2" bg="green-600"
            px-2 text-white transition-all
            hover:w-full focus:w-full
            style="background: {link.color}"
            href={link.href}>> {link.name}</a>
          </div>
        {/each}
      </div>
    </div>
  </div>
</template>