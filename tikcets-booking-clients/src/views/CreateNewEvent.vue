<template>
  <div class="home">
    <Row class="header"><h1>Tazkara</h1></Row>
    <Row class="bread-crumb">
      <Breadcrumb>
        <BreadcrumbItem>
          <router-link to="/event-provider-control-panel">
            Control panel
          </router-link>
        </BreadcrumbItem>
        <BreadcrumbItem>Create new event</BreadcrumbItem>
      </Breadcrumb>
    </Row>
    <Row class="title"><h2>New Event</h2></Row>
    <Row>
      <Col span="12" offset="6">
        <Alert show-icon>
          Fill these information to host a new event. The Event will be
          processed in 8 hours.
        </Alert>
        <Divider orientation="left">Basic Info</Divider>
        <Form
          ref="newEventForm"
          :model="formData"
          :rules="formRules"
          :label-width="130"
        >
          <Alert type="warning">
            These info are to find and recommend your event. fill them as
            detailed as possible
          </Alert>
          <FormItem label="Title" prop="title">
            <Input
              type="text"
              v-model="formData.title"
              placeholder="Enter the event title"
              class="input-feild"
            ></Input>
          </FormItem>
          <FormItem label="Desc" prop="desc">
            <Input
              v-model="formData.desc"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 7 }"
              placeholder="Whate is the event about..."
              class="input-feild"
            ></Input>
          </FormItem>
          <FormItem label="Location" prop="location">
            <Input
              type="text"
              v-model="formData.location"
              placeholder="Enter a valid location"
              class="input-feild"
            ></Input>
          </FormItem>
          <FormItem label="Date&Time">
            <DatePicker
              type="datetime"
              placeholder="Select date"
              v-model="formData.dateTime"
            ></DatePicker>
          </FormItem>
          <Divider orientation="left">Reservation</Divider>
          <FormItem label="Avialable Tickets">
            <Input
              type="number"
              v-model="formData.allTickets"
              placeholder="number of avialable tickets"
              style="width: 45%"
            ></Input>
          </FormItem>
          <FormItem label="price of single ticket">
            <Input
              type="number"
              v-model="formData.singleTicketPrice"
              placeholder="Enter the price of a single ticket"
              style="width: 45%"
            ></Input>
          </FormItem>
          <FormItem label="Reservation duedate">
            <DatePicker
              type="datetime"
              placeholder="Select date"
              v-model="formData.lastReservationDateTime"
            ></DatePicker>
          </FormItem>
          <Divider orientation="left">Classificatoin</Divider>
          <FormItem label="Main category" prop="mainCategory">
            <Select
              placeholder="select"
              v-model="formData.mainCategory"
              @on-change="updateSubCategories"
            >
              <Option
                v-for="mainCategory in mainCategories"
                :key="mainCategory"
                :value="mainCategory"
              >
                {{ mainCategory }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="Sub category" prop="subCategory">
            <Select
              placeholder="select"
              not-found-text="select main category first"
              v-model="formData.subCategory"
              @on-change="setupParticipantsArea"
            >
              <Option
                v-for="subCategory in subCategories"
                :key="subCategory"
                :value="subCategory"
              >
                {{ subCategory }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="Tags">
            <Input
              type="text"
              v-model="currTag"
              v-on:keyup.native.enter="addTag"
            ></Input>
            <Tag
              v-for="tag in formData.tags"
              :key="tag"
              closable
              @on-close="deleteTag(tag)"
              >{{ tag }}</Tag
            >
          </FormItem>
          <Divider orientation="left">Participants</Divider>
          <Alert type="error" v-show="showMissingNamesMsg">
            Participants names cannot be empty
          </Alert>
          <div v-show="showParticipantsArea">
            <div v-if="soloParticipant">
              <div
                v-for="(participant, index) in participants"
                :key="index"
                class="participant-card-solo"
              >
                <FormItem label="name" prop="participantName">
                  <Input
                    type="text"
                    v-model="participant.name"
                    placeholder="name"
                  ></Input>
                </FormItem>

                <FormItem label="role">
                  <Input
                    type="text"
                    v-model="participant.role"
                    placeholder="ex. Organizer"
                  ></Input>
                </FormItem>
                <Button
                  type="error"
                  shape="circle"
                  icon="md-trash"
                  style="margin-left: 1rem"
                  @click="deleteParticipant_solo(index)"
                ></Button>
              </div>
              <FormItem align="right">
                <Button type="primary" @click="addSoloParticipant()"
                  >Add participant
                </Button>
              </FormItem>
            </div>
            <div v-if="!soloParticipant">
              <Row>
                <Col span="11" class="team-title-container">
                  <div class="team-title" style="padding-left: 3rem">
                    Team 1
                  </div>
                </Col>
                <Col span="11" class="team-title-container" offset="2">
                  <div class="team-title">Team 2</div>
                </Col>
              </Row>
              <div v-for="(opponents, index) in participants" :key="index">
                <Row>
                  <Col span="11">
                    <FormItem label="name" prop="participantName">
                      <Input
                        type="text"
                        v-model="opponents.team_1.name"
                        placeholder="name"
                      ></Input>
                    </FormItem>
                  </Col>
                  <Col span="11">
                    <FormItem label="name" prop="participantName">
                      <Input
                        type="text"
                        v-model="opponents.team_2.name"
                        placeholder="name"
                      ></Input>
                    </FormItem>
                  </Col>
                  <Col span="2" v-show="canAddExtrapPartiipants">
                    <Button
                      type="error"
                      shape="circle"
                      icon="md-trash"
                      style="margin-left: 1rem"
                      @click="deleteParticipant(index)"
                    ></Button>
                  </Col>
                </Row>
              </div>
              <FormItem align="right" v-show="canAddExtrapPartiipants">
                <Button type="primary" @click="addMultiParticipant()"
                  >Add opppnents
                </Button>
              </FormItem>
            </div>
          </div>
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
    return {
      mainCategories: ["Entertainment", "Sports", "Education"],
      subCategories: [],
      participants: [],
      soloParticipant: false,
      showMissingNamesMsg: false,
      canAddExtrapPartiipants: true,
      showParticipantsArea: false,
      currTag: "",
      formData: {
        title: "",
        desc: "",
        location: "",
        dateTime: "",
        allTickets: "",
        singleTicketPrice: "",
        lastReservationDateTime: "",
        mainCategory: null,
        subCategory: null,
        tags: [],
      },
      formRules: {
        title: [
          { required: true, message: "Title cannot be empty", trigger: "blur" },
        ],
        location: [
          {
            required: true,
            message: "location cannot be empty",
            trigger: "blur",
          },
        ],
        desc: [
          { required: true, message: "Tell us who you are", trigger: "blur" },
          {
            type: "string",
            min: 50,
            message: "descriptoin cannot be less than 50 words",
            trigger: "blur",
          },
        ],
        mainCategory: [
          {
            required: true,
            message: "main category cannot be empty",
            trigger: "blur",
          },
        ],
        subCategory: [
          {
            required: true,
            message: "sub category cannot be empty",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    handleSubmit() {
      this.$refs["newEventForm"].validate((valid) => {
        if (valid) {
          const token = localStorage.getItem("token");
          axios({
            method: "post",
            url: "http://localhost:8888/api/v1/Events/Create",
            data: this.createFormData(),
            headers: { 
              "Content-Type": "multipart/form-data",  
              Authorization: `Bearer ${token}`,
            },
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
      this.$refs["newEventForm"].resetFields();
    },
    showConfirmationMsg() {
      this.$Message.success({
        content:
          "Your request has been submitted Successfully.Kindly check your email",
        duration: 20,
        closable: true,
      });
    },
    updateSubCategories() {
      this.showParticipantsArea = false;
      if (this.formData.mainCategory == "Entertainment") {
        this.subCategories = ["Movies", "Theatre", "Concert", "Standup show"];
      } else if (this.formData.mainCategory == "Sports") {
        this.subCategories = ["Football", "Tennis", "Basketball", "Volleyball"];
      } else if (this.formData.mainCategory == "Education") {
        this.subCategories = ["Conference", "Fair"];
      } else this.subCategories = [];
    },
    setupParticipantsArea() {
      if (this.formData.subCategory == null) return;
      this.showParticipantsArea = true;
      this.participants.length = 0;
      this.canAddExtrapPartiipants = true;
      if (
        this.formData.mainCategory == "Entertainment" ||
        this.formData.mainCategory == "Education"
      ) {
        this.soloParticipant = true;
        this.addSoloParticipant();
      } else if (this.formData.mainCategory == "Sports") {
        this.soloParticipant = false;
        this.addMultiParticipant();
        if (
          this.formData.subCategory == "Football" ||
          this.formData.subCategory == "Basketball"
        ) {
          this.canAddExtrapPartiipants = false;
        }
      }
    },
    createFormData() {
      const formData = new FormData();
      formData.append("ProviderName", localStorage.getItem("name"));
      formData.append("Title", this.formData.title);
      formData.append("Description", this.formData.desc);
      formData.append("Location", this.formData.location);
      formData.append("DateTime", this.formatDateTime(JSON.stringify(this.formData.dateTime)));
      formData.append("AllTickets", this.formData.allTickets);
      formData.append("SingleTicketPrice", this.formData.singleTicketPrice);
      formData.append("ReservationDueDate", this.formatDateTime(JSON.stringify(this.formData.lastReservationDateTime)));
      formData.append("Category", this.formData.mainCategory);
      formData.append("SubCategory", this.formData.subCategory);
      formData.append("Participants", this.getParticipantsList());
      formData.append("Tags", this.formData.tags);

      return formData;
    },
    addSoloParticipant() {
      const isValid = this.validateSoloParticipantInputs();
      if (!isValid) {
        this.showMissingNamesMsg = true;
        return;
      }
      this.showMissingNamesMsg = false;
      this.participants.push(this.newParticipant(1));
    },
    validateSoloParticipantInputs() {
      if (this.participants.length > 0) {
        const lastEntry = this.participants[this.participants.length - 1];
        if (lastEntry.name.trim() == "") {
          return false;
        }
      }
      return true;
    },
    addMultiParticipant() {
      const isValid = this.validateMultiParticipantInputs();
      if (!isValid) {
        this.showMissingNamesMsg = true;
        return;
      }
      this.showMissingNamesMsg = false;
      this.participants.push(this.newOpponents());
    },
    validateMultiParticipantInputs() {
      if (this.participants.length > 0) {
        const lastEntry = this.participants[this.participants.length - 1];
        if (
          lastEntry.team_1.name.trim() == "" ||
          lastEntry.team_2.name.trim() == ""
        ) {
          return false;
        }
      }
      return true;
    },
    deleteParticipant(index) {
      this.participants.splice(index, 1);
    },
    SocialMedia(type, link) {
      return {
        Type: type,
        Link: link === "" ? null : link,
      };
    },
    newParticipant(teamId) {
      return {
        team: teamId,
        name: "",
        role: "",
      };
    },
    newOpponents() {
      return {
        team_1: this.newParticipant(1),
        team_2: this.newParticipant(2),
      };
    },
    addTag() {
      const tagWithNoSpaces = this.currTag.trim();
      const doesTagAlreadyExist = this.formData.tags.includes(tagWithNoSpaces);
      if (!doesTagAlreadyExist) {
        this.formData.tags.push(tagWithNoSpaces);
      }
      this.currTag = "";
    },
    deleteTag(tag) {
      const index = this.formData.tags.indexOf(tag);
      this.formData.tags.splice(index, 1);
    },
    getParticipantsList() {
      const result = [];
      this.participants.forEach(participant => {
        result.push(participant.name+"/"+participant.role+"/"+participant.team)
      });
      return result;
    },
    formatDateTime(dateTime) {
      const mod1 = dateTime.substring(1, dateTime.lastIndexOf('.'));
      const parts = mod1.split('T');
      const mod2 = parts[0] + ' ' +parts[1];
      return mod2; 
    }
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

.participant-card-solo {
  display: flex;
  justify-content: space-between;
}

.team-title-container {
  display: flex;
  margin-bottom: 1rem;
}
.team-title {
  width: 100%;
  text-align: center;
  font-size: 0.9rem;
  font-weight: bold;
}
.tags-container {
  border-radius: 4px;
  border: 1px solid #dcdee2;
  margin-top: 1rem;
}
</style>
