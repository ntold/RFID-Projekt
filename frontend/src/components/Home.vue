<template>
  <div>
    <v-data-table :headers="headers" :items="RFIDS" class="elevation-1" hide-actions>
      <template v-slot:items="props">
        <tr @click="clickTable(props.item)">
          <td>{{ props.item.RFID }}</td>
          <td class="text-xs-right">{{ props.item.createdDate }}</td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import api from "@/services/api.js";

import * as io from "socket.io-client";

let socket = io("http://localhost:4000/");

export default {
  name: "Home",
  data() {
    return {
      selected: "",
      headers: [
        {
          text: "RFID",
          align: "left",
          sortable: false,
          value: "name"
        },
        // { text: "Vorname", value: "vorname" },
        // { text: "Name", value: "name" },
        { text: "Created", value: "createdDate", align: "right" }
      ],
      RFIDS: []
    };
  },
  methods: {
    fetchRFIDS: async function() {
      try {
        const response = await api().get("/getAll");
        this.RFIDS = response.data;
        console.log(this.RFIDS);
      } catch (err) {
        console.log(err);
      }
    },
    clickTable: function(item) {
      this.$router.push({
        path: `/${item.RFID}`
      });
    }
  },
  created() {
    this.fetchRFIDS();
    socket.on("test", data => {
      console.log(data);
    });
  }
};
</script>

<style>
</style>
