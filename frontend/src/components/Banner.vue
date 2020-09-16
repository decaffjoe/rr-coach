<template>
  <p id="banner">
    {{ text }}
    <a id="banner-link" @click="goToPage(link)">{{ linkText }}</a>
  </p>
</template>

<script>
export default {
  name: "Banner",
  props: { text: String, link: String, linkText: String },
  methods: {
    goToPage(link) {
      this.$router.push(link);
    },
  },
};
</script>

<style scoped>
#banner {
  color: darkolivegreen;
  background-color: #dfeadf;
  font-weight: 700;
  font-size: 0.9rem;
  margin: 0 10vw;
  padding: 0.5rem 1rem;
  border: 1px dashed darkolivegreen;
}
#banner-link {
  color: darkolivegreen;
  text-decoration: none;
  border-bottom: 1px dotted darkolivegreen;
}
#banner-link:hover {
  cursor: pointer;
}
@media (min-width: 900px) {
  #banner {
    width: fit-content;
    margin: 0 auto;
  }
}
</style>
