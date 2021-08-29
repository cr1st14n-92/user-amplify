<template>
  <v-app>
   <v-container >
    <v-row justify="center">
        <v-col cols="3"> <v-text-field label="user"  v-model="user" solo></v-text-field></v-col>
        <v-col cols="3"> <v-text-field label="email" v-model="email" solo></v-text-field></v-col>
        <v-col cols="1"> <v-btn color="primary" @click="addUser"> add </v-btn> </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="8">
        <v-simple-table dark>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left"  :style="{width:'200px'}" >
            User
          </th>
          <th class="text-left" :style="{width:'200px'}">
            Email
          </th>
          <th class="text-left">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        <tr  v-for="el in users"  :key="el.id">
          <td :style="{color:'white'}">{{el.name}}</td>
          <td>{{el.email}}</td>
          <td :style="{textAlign:'center'}">

               <v-btn
                fab
                dark
                small
                color="cyan"
                @click="openDialogEdit(el.id,el.name,el.email)"
              >
                <v-icon dark>
                  mdi-pencil
                </v-icon>
              </v-btn>

                 <span :style="{display:'inline-block',width:'20px'}" ></span>

                <v-btn
                fab
                dark
                small
                color="red"
                @click="deleteu(el.id)"
              >
                <v-icon dark>
                  mdi-delete
                </v-icon>
              </v-btn>

          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
      </v-col>
    </v-row>


   </v-container>
   <v-dialog
   v-model="dialog"
   max-width="600"
   persistent
   >
     
           <v-card  >
                 <v-card-title> Edit User</v-card-title>
                 <v-card-text><v-text-field label="user" v-model="user_edit.user"  solo/>
                  <v-text-field label="email"  v-model="user_edit.email"   solo/></v-card-text>

                  <v-card-actions>
                  <v-row justify="end">
                  <v-col cols="5">
                   <v-btn error @click="dialog=false">cancel</v-btn>
                   <span :style="{display:'inline-block',width:'20px'}" ></span>
                  <v-btn dark @click="updateUser">Edit</v-btn>
                  </v-col>
                  
                  </v-row>
                 
                  </v-card-actions>
           </v-card>
   </v-dialog>
  </v-app>
</template>

<script>
import { API, graphqlOperation } from 'aws-amplify'
import { createUser,deleteUser,updateUser } from './graphql/mutations'
import { listUsers } from './graphql/queries'

export default {
  name: 'App',

  components: {
  },

  data: () => ({
    user:"",
    email:"",
    users:[],
    dialog:false,
    user_edit:{
      id:"",
      user:"",
      email:""
    }
  }),
 mounted(){
     this.listar()
 },
  methods:{
    listar:async  function (){
           const data =  await API.graphql(graphqlOperation(listUsers))
           
           this.users = data.data.listUsers.items
    },
    async addUser(){

      if(this.user.length<=0){
        alert("miss user")
        return
      }

      if(this.email.length<=0){
        alert("miss email")
        return
      }

        
       const todo = { name: this.user, email: this.email };
        await API.graphql(graphqlOperation(createUser, {input: todo}));
         this.listar()
         this.email=""
         this.user=""
    },
    async deleteu(id){
      const todo = { id:id};
         await API.graphql(graphqlOperation(deleteUser, {input: todo}));
         this.listar()


    },
    openDialogEdit(id,user,email){
      this.user_edit.id=id
      this.user_edit.user=user
      this.user_edit.email=email
      this.dialog= true

    },
    async updateUser(){
       if(this.user_edit.user.length<=0){
        alert("miss user")
        return
      }

      if(this.user_edit.email.length<=0){
        alert("miss email")
        return
      }

      const todo = { id:this.user_edit.id,name: this.user_edit.user, email:  this.user_edit.email };
        await API.graphql(graphqlOperation(updateUser, {input: todo}));
           this.listar()
              this.user_edit.id=""
      this.user_edit.user=""
      this.user_edit.email=""
             this.dialog= false
    }
  }
};
</script>
