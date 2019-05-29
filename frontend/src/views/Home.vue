<template>
  <div>
    <h1 class="display-3 text-xs-center mt-5">RFID-Project</h1>
    <h2 class="title text-xs-center">Dany &amp; Nico</h2>
    <v-content class="ma-5">
      <v-layout row align-center wrap class="ma-5">
        <v-flex 
          xs3
          class="pa-3"
          v-for="RFID in RFIDS" :key="RFID._id"
        >
          <v-card
            class=" animated bounceIn"
            :class="[RFID._id == takenID ? 'active' : 'elevation-0 pa-4 background grey lighten-2 panel text-truncate' ]"
            @click="openMenu(RFID)"
            height="200px"
          >
            <v-layout wrap>
              <v-flex xs12 class="pa-4">
                <h5 class="headline text-xs-center ">
                  {{RFID.RFID}}
                </h5>
              </v-flex>
              <v-flex xs12 class="pa-4">
                <div class="subheading text-xs-center">
                  {{RFID.Vorname}}
                </div>
                <div class="subheading text-xs-center">
                  {{RFID.Nachname}} 
                </div>
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>
      </v-layout>
      <v-dialog
        v-model="dialog"
        max-width="500px"
      >
        <v-card class="pa-4">
          <v-layout column>
            <v-flex>
              <h4 class="display-1 text-xs-center pa-3">
                {{currentRFID.RFID}}
              </h4>
            </v-flex>
            <v-flex>
              <div class="pa-3">
                <v-text-field solo placeholder="Vorname" :label="currentRFID.Vorname" v-model="chipData.Vorname"></v-text-field>
              </div>
            </v-flex>
            <v-flex>
              <div class="px-3">
                <v-text-field 
                  solo 
                  @keyup.enter="update"
                  placeholder="Nachname" 
                  v-model="chipData.Nachname"
                ></v-text-field>
              </div>
            </v-flex>
            <v-flex>
              <div class="text-xs-right px-3">
                {{currentRFID.createdDate}}
              </div>
            </v-flex>
            <v-flex>
              <v-layout align-center justify-center row class="pa-3">
                <div class="text-xs-center">
                  <v-btn 
                    outline class="orange--text text--darken-2"
                    @click="dialog = !dialog"
                  >Close</v-btn>
                </div>
                <div class="text-xs-center">
                  <v-btn 
                    class="orange darken-2"
                    @click="update"
                  >Update</v-btn>
                </div>
                <div class="text-xs-center">
                  <v-btn 
                    class="red darken-2"
                    @click="remove"
                  >Delete</v-btn>
                </div>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card>
      </v-dialog>
    </v-content>
  </div>
</template>

<script>
import RFIDService from "@/services/RFIDService"
import * as io from "socket.io-client"
const socket = io("http://localhost:4000/")

export default {
  name: "Home",
  data() {
    return {
      RFIDS: [],
      currentRFID: {},
      takenID: '',
      dialog: false,
      chipData: {
        Vorname: '',
        Nachname: ''
      }
    }
  },
  methods: {
    fetch: async function(){
      try {
        let response = await RFIDService.getAll()
        this.RFIDS = response.data
      } catch (err) {
        console.log(err)
      }
    },
    update: async function(){
      try {
        this.dialog = !this.dialog
        this.chipData.Id = this.currentRFID._id
        
        let updatedData = (await RFIDService.update(this.chipData)).data.message

        this.RFIDS.map(RFID => {
          if(this.currentRFID._id == updatedData._id){
            RFID.Vorname = updatedData.Vorname
            RFID.Nachname = updatedData.Nachname
          }
        })
          
      } catch (err) {
        console.log(err)
      }
      this.$router.go({path: "/"})
    },
    remove: async function(){
      try {
        await RFIDService.remove(this.currentRFID)
        this.dialog = !this.dialog
      } catch (err) {
        console.log(err);
      }
      this.$router.go({path: "/"})
    },
    openMenu: function(RFID) {
      this.currentRFID = RFID
      this.dialog = !this.dialog
    }
  },
  created() {
    this.fetch()
    socket.on("create", data => {
      this.RFIDS.push(data)
    }),
    socket.on("alreadyTaken", data => {
      this.takenID = data[0]._id
      setTimeout(() => {
        this.takenID = ''
      }, 1000);
    })
  }
}
</script>

<style>
.background{
  background-image: url('../assets/tag.png');
  background-size: cover;
  background-position: top center;
  border-radius: 25px;

}

.background:hover{
  background-color: #F57C00 !important;
}

.active{
  background-image: url('../assets/tag.png');
  background-size: cover;
  background-position: top center;
  border-radius: 25px;
  background-color: #F57C00 !important;
}


</style>
