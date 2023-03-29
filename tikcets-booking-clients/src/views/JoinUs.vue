<template>
  <div class="home">
    <Row class="header"><h1>Tazkara</h1></Row>
    <Row class="bread-crumb">
      <Breadcrumb>
        <BreadcrumbItem>
          <router-link to="/">Home</router-link>
        </BreadcrumbItem>
        <BreadcrumbItem>Join us</BreadcrumbItem>
      </Breadcrumb>
    </Row>
    <Row class="title"><h2>Join us</h2></Row>
    <Row>
      <Col span="12" offset="6">
        <Alert show-icon
          >Fill these information to be a verified event provider. Your request
          will be processed in 24 hours from the time of submission</Alert
        >
        <Divider orientation="left">Authentication</Divider>
        <Form
          ref="registerForm"
          :model="formData"
          :rules="formRules"
          :label-width="130"
        >
          <Alert type="warning">
            The password entered will be setup only in case of verification
          </Alert>
          <FormItem label="Email" prop="email">
            <Input
              type="text"
              v-model="formData.email"
              placeholder="Enter a valid email address"
              class="input-feild"
            ></Input>
          </FormItem>
          <FormItem label="Password" prop="password">
            <Input
              type="password"
              v-model="formData.password"
              placeholder="Enter a password"
              class="input-feild pass-input"
            ></Input>
          </FormItem>
          <div class="password-item">
            <FormItem label="Confrim password" prop="confirmPassword">
              <Input
                type="password"
                v-model="formData.reEnteredPassword"
                placeholder="Re enter the password"
                class="input-feild"
              ></Input>
            </FormItem>
          </div>
          <Divider orientation="left">Basic Info</Divider>
          <FormItem label="Name" prop="name">
            <Input
              v-model="formData.name"
              placeholder="Enter your name or the name of your company/organisaion"
              class="input-feild"
            ></Input>
          </FormItem>
          <FormItem label="Desc" prop="desc">
            <Input
              v-model="formData.desc"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 7 }"
              placeholder="Enter something..."
              class="input-feild"
            ></Input>
          </FormItem>
          <Divider orientation="left">Proof of Identity</Divider>
          <Alert type="error" v-show="showMissingLinkAlert"
            >Provide at least one link as a proof of identity</Alert
          >
          <FormItem label="Website" prop="link">
            <Input
              type="text"
              v-model="formData.links.website"
              placeholder="Enter a link to an officila website"
              class="input-feild"
            >
              <Icon type="md-planet" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem label="Facebook" prop="link">
            <Input
              type="text"
              v-model="formData.links.facebook"
              placeholder="Enter a link to a Facebook page or account"
              class="input-feild"
            >
              <Icon type="logo-facebook" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem label="Instgram" prop="link">
            <Input
              type="text"
              v-model="formData.links.instagram"
              placeholder="Enter a link to an Instgram account"
              class="input-feild"
            >
              <Icon type="logo-instagram" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem label="Youtube" prop="link">
            <Input
              type="text"
              v-model="formData.links.youtube"
              placeholder="Enter a link to a Youtube channel"
              class="input-feild"
            >
              <Icon type="logo-youtube" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem label="Twitter" prop="link">
            <Input
              type="text"
              v-model="formData.links.twitter"
              placeholder="Enter a link to a Twitter account"
              class="input-feild"
            >
              <Icon type="logo-twitter" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem align="center" class="footer">
            <Button type="primary" @click="handleSubmit()">Submit</Button>
            <Button @click="handleReset()" style="margin-left: 8px"
              >Reset</Button
            >
          </FormItem>
        </Form>
      </Col>
    </Row>
  </div>
</template>

<script>
// @ is an alias to /src "@/components/HelloWorld.vue"
import axios from "axios";

export default {
  name: "JoinUs",
  components: {},
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
    const validateIndetity = (rule, value, callback) => {
      this.showMissingLinkAlert = false;
      if (this.formData.links.website !== "") callback();
      else if (this.formData.links.facebook !== "") callback();
      else if (this.formData.links.instagram !== "") callback();
      else if (this.formData.links.youtube !== "") callback();
      else if (this.formData.links.twitter !== "") callback();
      else {
        this.showMissingLinkAlert = true;
        callback();
      }
    };
    const validateNewName = (rule, value, callback) => {
      axios({
        method: "get",
        url: "http://localhost:8888/api/v1/EventProviders/EventProviderAlreadyExist",
        params: { name: this.formData.name },
      })
        .then((response) => {
          const doesAlreadyExist = response.data.model;
          if (doesAlreadyExist) callback(new Error("Name is already taken"));
          else callback();
        })
        .catch((error) => console.log(error));
    };
    return {
      showMissingLinkAlert: false,
      formData: {
        email: "",
        password: "",
        reEnteredPassword: "",
        name: "",
        desc: "",
        links: {
          website: "",
          facebook: "",
          instagram: "",
          youtube: "",
          twitter: "",
        },
      },
      formRules: {
        email: [
          { required: true, message: "email cannot be empty", trigger: "blur" },
          { type: "email", message: "Incorrect email format", trigger: "blur" },
        ],
        password: [
          {
            required: true,
            message: "Please fill in the password.",
            trigger: "blur",
          },
          {
            type: "string",
            pattern: new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{10,})"),
            message: `The password must contain at least one lower case alphabetical character 
                            and at least one upper case alphapetical character and at least one numeric 
                            character and be 10 characters or longer`,
            trigger: "blur",
          },
        ],
        confirmPassword: [
          { validator: validateReEnteredPassword, trigger: "blur" },
        ],
        name: [
          {
            required: true,
            message: "The name cannot be empty",
            trigger: "blur",
          },
          { validator: validateNewName, trigger: "blur" },
        ],
        desc: [
          { required: true, message: "Tell us who you are", trigger: "blur" },
          {
            type: "string",
            min: 100,
            message: "descriptoin cannot be less than 100 words",
            trigger: "blur",
          },
        ],
        link: [{ validator: validateIndetity, trigger: "blur" }],
      },
    };
  },
  methods: {
    handleSubmit() {
      this.$refs["registerForm"].validate((valid) => {
        if (valid) {
          axios({
            method: "post",
            url: "http://localhost:8888/api/v1/EventProviders/Register",
            data: this.createFormData(),
            headers: { "Content-Type": "multipart/form-data" },
          })
            .then(() => {
              this.handleReset();
              this.showConfirmationMsg();
            })
            .catch((error) => console.log(error));
        } else {
          this.$Message.error("Please enter the information!");
        }
      });
    },
    handleReset() {
      this.$refs["registerForm"].resetFields();
    },
    showConfirmationMsg() {
      this.$Message.success({
        content:
          "Your request has been submitted Successfully..Kindly check your email",
        duration: 20,
        closable: true,
      });
    },
    createFormData() {
      const formData = new FormData();
      formData.append("Name", this.formData.name);
      formData.append("Password", this.formData.password);
      formData.append("Email", this.formData.email);
      formData.append("Bio", this.formData.desc);
      formData.append("WebsiteLink", this.formData.links.website);

      var socialMedias = [
        this.SocialMedia("facebook", this.formData.links.facebook),
        this.SocialMedia("instagram", this.formData.links.instagram),
        this.SocialMedia("youtube", this.formData.links.youtube),
        this.SocialMedia("twitter", this.formData.links.twitter),
      ];
      formData.append("SocialMedias", JSON.stringify(socialMedias));

      return formData;
    },
    SocialMedia(type, link) {
      return {
        Type: type,
        Link: link === "" ? null : link,
      };
    },
  },
};
</script>

<style scoped>
.header {
  padding: 0.5rem 0rem;
  text-align: center;
  background-color: #161616;
  color: white;
}
.bread-crumb {
  margin: 0.5rem 1rem;
}
.title {
  padding: 0.5rem 1rem;
  font-size: large;
  margin-bottom: 1rem;
}
.input-feild {
  width: 100%;
}
.password-item {
  margin-top: 2rem;
}
.footer {
  width: 100%;
}
</style>
