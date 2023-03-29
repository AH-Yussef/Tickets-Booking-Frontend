
<template>
  <div class="login">
    <div class="title">Create a new Accout</div>
    <Form ref="customer-signup-form" :model="formData" :rules="rules" class="form">
      <FormItem prop="name">
        <Input type="text" v-model="formData.name" placeholder="User name">
          <Icon type="ios-person-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem prop="email">
        <Input type="text" v-model="formData.email" placeholder="Email">
          <Icon type="ios-mail-outline" slot="prepend"></Icon>
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
      <FormItem prop="confirmPassword">
        <Input
          type="password"
          v-model="formData.reEnteredPassword"
          placeholder="re-enter the password"
        >
          <Icon type="ios-lock-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem align="center">
        <Button type="primary" @click="handleSubmit()"> Sign up </Button>
      </FormItem>
      <FormItem align="center">
        <div class="sign-up">
          <span style="margin-right: 0.3rem">Already have an accout?</span>
          <router-link to="/customer-login">Sign in</router-link>
        </div>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    const validateReEnteredPassword = (rule, value, callback) => {
      if (this.formData.reEnteredPassword === "") {
        callback(new Error("re enter the password again"));
      } else if (this.formData.reEnteredPassword !== this.formData.password) {
        callback(new Error("The two input passwords do not match!"));
      } else {
        callback();
      }
    };
    return {
      formData: {
        name: "",
        email: "",
        password: "",
        reEnteredPassword: "",
      },
      rules: {
        name: [
          {
            required: true,
            message: "Please fill in the name",
            trigger: "blur",
          },
        ],
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
        confirmPassword: [
          { validator: validateReEnteredPassword, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    handleSubmit() {
      this.$refs["customer-signup-form"].validate((valid) => {
        if (valid) {
          axios({
            method: "post",
            url: "http://localhost:8888/api/v1/Customer/Register",
            data: {
              name: this.formData.name,
              email: this.formData.email,
              password: this.formData.password,
            },
          })
            .then(() => {
              this.handleReset();
              this.showConfirmationMsg();
            })
            .catch((error) => console.log(error));
        } else {
          this.$Message.error("Please Enter all fields!");
        }
      });
    },
    handleReset() {
      this.$refs["customer-signup-form"].resetFields();
      this.formData.reEnteredPassword = "";
    },
    showConfirmationMsg() {
      this.$Message.success({
        content:
          "Your account has been created..Please verify your email",
        duration: 20,
        closable: true,
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
.sign-up {
  font-size: 0.85rem;
}
</style>
