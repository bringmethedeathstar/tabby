<template>
  <div class="space-y-6">
    <section class="space-y-4">
      <div>
        <label class="block font-semibold">Title</label>

        <input
          type="text"
          :value="title"
          :disabled="true"
        />
      </div>

      <div>
        <label class="block font-semibold">Description</label>

        <textarea
          :value="description"
          :disabled="true"
        />
      </div>
    </section>

    <section
      v-for="item in meta"
      :key="item.section"
    >
      <h2 class="text-xl font-semibold capitalize">{{ item.section }}</h2>

      <ul class="list-inside list-disc space-y-4">
        <li
          v-for="el in item.elements"
          :key="el.name"
        >
          <span class="capitalize">{{ el.name.toLowerCase() }}</span>

          <ul class="list-inside list-disc space-y-2 pl-4">
            <li
              v-for="attr in el.attributes"
              :key="attr.name"
            >
              {{ attr.name }} - {{ attr.value }}
            </li>
          </ul>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
const description = ref(null)
const rawMeta = ref([])
const title = ref(null)
const tab = ref(null)

const meta = computed(() => {
  return Object.entries(rawMeta.value).map(([section, elements]) => {
    return {
      section,
      elements: elements.map((stringElement) => {
        const container = document.createElement('template')

        container.innerHTML = stringElement.trim()

        const el = container.content.firstChild
        const attributes = []

        for (let i = 0; i < el.attributes.length; i++) {
          const { name, value } = el.attributes.item(i)

          attributes.push({ name, value })
        }

        return { name: el.tagName, attributes }
      }),
    }
  })
})

onMounted(() => {
  getActiveTab()
})

function getActiveTab() {
  chrome.tabs
    .query({ active: true, currentWindow: true })
    .then(function (tabs) {
      var activeTab = tabs[0]

      tab.value = activeTab

      return chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: getDOM,
      })
    })
    .then((results) => {
      // Awkward syntax as executeScript.func can only return string or arrays
      const dom = results[0].result[0]

      title.value = dom.title
      description.value = dom.description
      rawMeta.value = dom.tags
    })
    .catch((error) => console.error(error))
}

function getDOM() {
  function getHTML(selector: string, target = 'outerHTML') {
    return Array.from(document.querySelectorAll(selector)).map((element) => {
      return element[target]
    })
  }

  return [
    {
      title: getHTML('title', 'innerHTML')[0],
      description: getHTML('meta[name="description"]', 'content')[0],
      tags: {
        links: getHTML('head link'),
        meta: getHTML('head meta'),
      },
    },
  ]
}
</script>

<style scoped></style>
