<template>
  <v-layout>
    <app-bar />

    <v-main>
      <v-container fluid>
        <v-data-table :items="items"></v-data-table>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
const headers = [
  { title: 'Field', value: 'field' },
  { title: 'Farm Site', key: 'name.last' },
  {
    title: 'Full Name',
    key: 'fullName',
    // value: item => `${item.name.first} ${item.name.last}`,
  },
]
const items = [
  {
    name: 'African Elephant',
    species: 'Loxodonta africana',
    diet: 'Herbivore',
    habitat: 'Savanna, Forests',
  },
  {
    name: 'Bald Eagle',
    species: 'Haliaeetus leucocephalus',
    diet: 'Carnivore',
    habitat: 'Forests, Mountains, Near water',
  },
  {
    name: 'Giant Panda',
    species: 'Ailuropoda melanoleuca',
    diet: 'Herbivore',
    habitat: 'Bamboo forests, Mountains',
  },
  {
    name: 'Grizzly Bear',
    species: 'Ursus arctos horribilis',
    diet: 'Omnivore',
    habitat: 'Forests, Tundra, Mountains',
  },
  {
    name: 'Koala',
    species: 'Phascolarctos cinereus',
    diet: 'Herbivore',
    habitat: 'Eucalyptus forests',
  },
  {
    name: 'Cheetah',
    species: 'Acinonyx jubatus',
    diet: 'Carnivore',
    habitat: 'Grasslands, Savannas',
  },
  {
    name: 'Blue Whale',
    species: 'Balaenoptera musculus',
    diet: 'Carnivore (Plankton, Krill)',
    habitat: 'Oceans',
  },
  {
    name: 'King Cobra',
    species: 'Ophiophagus hannah',
    diet: 'Carnivore',
    habitat: 'Forests, Grasslands',
  },
  {
    name: 'Red Kangaroo',
    species: 'Macropus rufus',
    diet: 'Herbivore',
    habitat: 'Grasslands, Deserts',
  },
  {
    name: 'Emperor Penguin',
    species: 'Aptenodytes forsteri',
    diet: 'Carnivore (Fish, Squid)',
    habitat: 'Antarctica',
  },
  {
    name: 'Siberian Tiger',
    species: 'Panthera tigris altaica',
    diet: 'Carnivore',
    habitat: 'Forests, Mountains',
  },
  {
    name: 'Great White Shark',
    species: 'Carcharodon carcharias',
    diet: 'Carnivore',
    habitat: 'Oceans',
  },
  {
    name: 'Giraffe',
    species: 'Giraffa camelopardalis',
    diet: 'Herbivore',
    habitat: 'Savannas, Woodlands',
  },
  {
    name: 'Snow Leopard',
    species: 'Panthera uncia',
    diet: 'Carnivore',
    habitat: 'Mountains, Grasslands',
  },
  {
    name: 'Green Anaconda',
    species: 'Eunectes murinus',
    diet: 'Carnivore',
    habitat: 'Rainforests, Swamps',
  },
];

</script>
