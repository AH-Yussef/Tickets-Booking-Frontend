<template>
  <div class="login">
    <div class="title">Admin Auth</div>
    <Form ref="admin-login-form" :model="formData" :rules="rules" class="form">
      <FormItem prop="email">
        <Input type="text" v-model="formData.email" placeholder="Email">
          <Icon type="ios-person-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem prop="password">
        <Input
          type="password"
          v-model="formData.password"
          placeholder="Password"
        >
          <Icon type="ios-lock-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem align="center">
        <Button type="primary" @click="handleSubmit()"> Signin </Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      formData: {
        email: "",
        password: "",
      },
      rules: {
        email: [
          {
            required: true,
            message: "Please fill in the email",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "Please fill in the password.",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    handleSubmit() {
      this.$refs["admin-login-form"].validate((valid) => {
        if (valid) {
          axios({
            method: "post",
            url: "http://localhost:8888/api/v1/Admin/AuthAdmin",
            data: {
              Email: this.formData.email,
              Password: this.formData.password,
            },
          })
            .then((response) => {
              const token = response.data.model.token;
              localStorage.setItem("token_admin", token);
              this.$router.push("control-panel");
            })
            .catch(() => {
              this.$Message.error({
                content: "Email Or Password may be wrong",
                duration: 20,
                closable: true,
              });
            });
        } else {
          this.$Message.error("Please Enter all fields!");
        }
      });
    },
  },
};
</script>

<style scoped>
.login {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.title {
  margin-bottom: 1.5rem;
  font-size: x-large;
  font-weight: bold;
}
.form {
  width: 33%;
}
</style>
