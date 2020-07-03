<template>
    <div>
        <iframe width="400" height="200" :src="currentVariant.url" v-if="currentVariant.url"></iframe>
        <ul v-if="currentVariant.desc">
            <li v-for="point of currentVariant.desc.split('.')" :key="point.id">{{ point }}</li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "TrainingInfo",
    props: {
        currentVariant: {
            type: Object
        }
    }
}
</script>

<style scoped>
iframe {
    display: block;
    margin: 0 auto;
}
</style>
