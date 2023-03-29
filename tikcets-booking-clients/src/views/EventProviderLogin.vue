<template>
  <div class="login">
    <div class="title">Event Provider sign in</div>
    <Form ref="provider-login-form" :model="formData" :rules="rules" class="form">
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
      <FormItem align="center">
        <div class="sign-up">
          <span style="margin-right: 0.3rem">don't have an account?</span>
          <router-link to="/JoinUs">Join Us</router-link>
        </div>
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
      this.$refs["provider-login-form"].validate((valid) => {
        if (valid) {
          axios({
            method: "post",
            url: "http://localhost:8888/api/v1/EventProviders/Auth",
            data: {
              email: this.formData.email,
              password: this.formData.password,
            },
          })
            .then((response) => {
              const token = response.data.model.token;
              const name = response.data.model.name
              localStorage.setItem("token", token);
              localStorage.setItem("name", name);
              this.$router.push("event-provider-control-panel");
              this.handleReset();
            })
            .catch(() => {
              this.$Message.error({
                content:
                  "You may not be yet authorized or may be the email or password is wrong",
                duration: 20,
                closable: true,
              });
                this.handleReset();
            });
        } else {
          this.$Message.error("Please Enter all fields!");
        }
      });
    },
    handleReset() {
      this.$refs["provider-login-form"].resetFields();
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
.sign-up {
  font-size: 0.85rem;
}
</style>
