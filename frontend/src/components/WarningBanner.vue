<template>
  <p id="banner">
    {{ text }}
    <router-link id="banner-link" :to="link">{{ linkText }}</router-link>
  </p>
</template>

<script>
export default {
  name: "Banner",
  props: { text: String, link: String, linkText: String },
};
</script>

<style scoped>
#banner {
  color: white;
  background-color: #f66;
  font-weight: 700;
  font-size: 0.9rem;
  margin: 0 10vw;
  padding: 0.5rem 1rem;
  border: 2px dashed #f00;
}
#banner-link {
  color: white;
  text-decoration: none;
  border-bottom: 1px dotted white;
}
#banner-link:hover {
  cursor: pointer;
}
@media (min-width: 900px) {
  #banner {
    max-width: 60vw;
    margin: 0 auto;
  }
}
</style>
