<template>
    <div>
        <button @click="easierVariant" v-if="currentSection !== 'Warmups' && currentVariant.num > 0">Easier Variant</button>
        <h2>{{ currentVariant.name }}</h2>
        <button @click="tougherVariant" v-if="currentSection !== 'Warmups' && currentVariant.num < currentVariant.max">Tougher Variant</button>
    </div>
</template>

<script>
export default {
    name: "TrainingVariantControl",
    props: {
        currentVariant: {
            type: Object
        },
        currentSection: {
            type: String
        }
    },
    methods: {
        easierVariant() { this.$emit('easierVariant') },
        tougherVariant() { this.$emit('tougherVariant') }
    }
}
</script>

<style scoped>
div>* {
    display: inline-block;
}
</style>
