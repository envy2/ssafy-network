<template>
  <v-container>
    <h1>User 관리</h1>
    <v-layout justify-center text-xs-center row class="mb-5">
      <v-btn to="/admin/user" color="grey darken-2" class="white--text">유저관리</v-btn>
      <v-btn to="/admin/chat" color="grey darken-2" class="white--text">채팅방관리</v-btn>
      <v-btn to="/admin/notice" color="grey darken-2" class="white--text">공지사항관리</v-btn>
      <v-btn to="/admin/dep" color="grey darken-2" class="white--text">부서관리</v-btn>
      <v-spacer></v-spacer>
    </v-layout>

    <v-card class="mb-2">
      <div class="searchdep">
        <v-text-field v-model="superdepartment" class="mx-2"></v-text-field>
        <v-btn @click="getDepartmentList" color="grey darken-2" class="white--text mx-2">부서 검색</v-btn>
        <v-select v-model="first" label="부서찾기" :items="firsts" @change="getChildList" class="mx-2"></v-select>
        <v-select
          v-if="showbtn"
          v-model="second"
          label="부서찾기"
          :items="seconds"
          @change="pull"
          class="mx-2"
        ></v-select>
        <v-btn
          v-if="!showbtn"
          @click="updateDePo"
          class="mx-2 white--text"
          color="grey darken-2"
        >직급 변경</v-btn>
      </div>
    </v-card>
    <router-view></router-view>

    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="desserts"
      item-key="_id"
      select-all
      class="elevation-1 mb-3"
    >
      <template v-slot:items="props">
        <td>
          <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
        </td>
        <td>{{ props.item.nickname }}</td>
        <td class="text-xs-left">{{ props.item.id }}</td>
        <td class="text-xs-left">{{ props.item.name }}</td>
        <td class="text-xs-left">{{ props.item.department }}</td>
        <td class="text-xs-left">{{ props.item.position }}</td>
        <td class="text-xs-left">{{ props.item.membership }}</td>
      </template>
    </v-data-table>
    <v-card>
      <div class="getmembership">
        <v-select v-model="membership" label="등급" :items="memberships" required></v-select>
        <v-btn @click="updateUserMembership" color="grey darken-2" class="white--text">등급 변경</v-btn>
      </div>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      superdepartment: "",
      first: "",
      firsts: [],
      second: "",
      seconds: [],
      showbtn: true,
      token: this.$session.get("token"),
      id: this.$session.get("id"),
      dbserver: this.$store.state.dbserver,
      pagination: {
        sortBy: "name"
      },

      membership: "회원",
      memberships: ["비회원", "회원", "관리자"],
      selected: [],
      headers: [
        {
          text: "닉네임",
          align: "left",
          value: "nickname"
        },
        { text: "아이디", value: "id" },
        { text: "이름", value: "name" },
        { text: "부서", value: "department" },
        { text: "기수", value: "position" },
        { text: "등급", value: "membership" }
      ],
      desserts: []
    };
  },
  mounted() {
    this.getUserList();
  },
  methods: {
    clear() {
      this.showbtn = true;
      this.firsts = [];
      this.first = "";
      this.seconds = [];
      this.second = "";
    },
    updateDePo() {
      this.updateUserDepartment();
      this.updateUserPosition();
    },
    pull() {
      this.superdepartment = this.first;
      this.firsts = this.seconds;
      this.first = this.second;
      this.getChildList();
    },
    getDepartmentList() {
      this.clear();
      fetch(
        this.$store.state.dbserver + "/company/join/" + this.superdepartment,
        {
          method: "GET",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
          }
        }
      )
        .then(res => res.json())
        .then(data => {
          if (data) {
            this.firsts = data.children;
          }
        });
    },
    getChildList() {
      fetch(this.$store.state.dbserver + "/company/join/" + this.first, {
        method: "GET",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.result == false) {
            this.showbtn = false;
          } else {
            this.seconds = data.children;
          }
        });
    },
    getUserList() {
      fetch(
        this.$store.state.dbserver + "/users/" + this.$session.get("token"),
        {
          method: "GET",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
          }
        }
      )
        .then(res => res.json())
        .then(data => {
          if (data) {
            this.desserts = data;
          } else {
            alert("관리자 권한이 없습니다");
          }
        })
        .catch(error => console.log(error))
        .finally();
    },
    updateUserDepartment() {
      for (let index = 0; index < this.selected.length; index++) {
        fetch(this.$store.state.dbserver + "/users/department", {
          method: "PUT",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            token: this.$session.get("token"),
            _id: this.selected[index]._id,
            department: this.superdepartment
          })
        })
          .then(res => res.json())
          .then(data => {
            if (data.result == true) {
              this.getUserList();
            } else {
              alert("수정 실패");
            }
          });
      }
    },
    updateUserPosition() {
      for (let index = 0; index < this.selected.length; index++) {
        fetch(this.$store.state.dbserver + "/users/position", {
          method: "PUT",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            token: this.$session.get("token"),
            _id: this.selected[index]._id,
            position: this.first
          })
        })
          .then(res => res.json())
          .then(data => {
            if (data.result == true) {
              this.getUserList();
            } else {
              alert("수정 실패");
            }
          });
      }
    },
    updateUserMembership() {
      for (let index = 0; index < this.selected.length; index++) {
        fetch(this.$store.state.dbserver + "/users/membership", {
          method: "PUT",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            token: this.$session.get("token"),
            _id: this.selected[index]._id,
            membership: this.membership
          })
        })
          .then(res => res.json())
          .then(data => {
            if (data.result == true) {
              this.getUserList();
            } else {
              alert("수정 실패");
            }
          });
      }
    },
    deleteUser() {
      fetch(this.$store.state.dbserver + "/users", {
        method: "DELETE",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          _id: "오브젝트 아이디",
          token: this.$session.get("token")
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.result == true) {
            alert("삭제 성공!!!");
          } else {
            alert("성공 실패...");
          }
        });
    },
    searchUsers() {
      fetch(
        this.$store.state.dbserver +
          "/search/users/" +
          "id" +
          "/" +
          "t" +
          "/" +
          this.$session.get("token"),
        {
          method: "GET",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
          }
        }
      )
        .then(res => res.json())
        .then(data => {
          if (data) {
            this.userList = data;
          } else {
            alert("올바른 값을 입력하세요");
          }
        })
        .catch(error => console.log(error))
        .finally();
    }
  }
};
</script>

<style>
.getmembership {
  display: flex;
  align-items: center;
  padding: 10px 1.5rem;
}
.searchdep {
  display: flex;
  align-items: center;
  padding: 0px 1.5rem;
}
</style>
