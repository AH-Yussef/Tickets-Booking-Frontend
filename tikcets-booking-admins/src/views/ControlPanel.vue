<template>
  <div class="admin-panel">
    <div class="header"><h1>Tazkara</h1></div>
    <div class="main">
      <Menu
        theme="light"
        :active-name="currentPanel"
        class="menu"
        @on-select="changePane"
      >
        <MenuItem name="1">
          <Icon type="md-briefcase" />
          EventProviders
        </MenuItem>
        <MenuItem name="2" @click="test('2')">
          <Icon type="ios-navigate" />
          Events
        </MenuItem>
      </Menu>
      <div v-show="currentPanel === '1'" class="event-provider-pane">
        <div class="sub-title">
          <h2>Pending Joining Requests</h2>
          <Button
            icon="md-refresh"
            type="default"
            shape="circle"
            class="refresh-btn"
            @click="getPendingEventProviders()"
          ></Button>
        </div>
        <Collapse simple accordion @on-change="getEventProviderInfo">
          <Panel
            v-for="provider in pendingEventProviderRequests"
            :key="provider.name"
            :name="provider.name"
          >
            <span class="info-title">{{ provider.name }}</span>
            <div slot="content">
              <div class="sub-info">
                <Icon type="md-mail" />
                <div class="sub-info-label">Email</div>
                <div class="sub-info-content">
                  {{ currentProviderInfo.Email }}
                </div>
              </div>
              <div class="sub-info">
                <Icon type="md-document" />
                <div class="sub-info-label">Bio</div>
                <div class="sub-info-content">
                  {{ currentProviderInfo.Bio }}
                </div>
              </div>
              <div
                class="sub-info"
                v-show="currentProviderInfo.Links.website != null"
              >
                <Icon type="md-planet" />
                <div class="sub-info-label">Website</div>
                <div class="sub-info-content">
                  <a :href="currentProviderInfo.Links.website">
                    {{ currentProviderInfo.Links.website }}
                  </a>
                </div>
              </div>
              <div
                class="sub-info"
                v-show="currentProviderInfo.Links.facebook != null"
              >
                <Icon type="logo-facebook" />
                <div class="sub-info-label">Facebook</div>
                <div class="sub-info-content">
                  <a :href="currentProviderInfo.Links.facebook">
                    {{ currentProviderInfo.Links.facebook }}
                  </a>
                </div>
              </div>
              <div
                class="sub-info"
                v-show="currentProviderInfo.Links.instagram != null"
              >
                <Icon type="logo-instagram" />
                <div class="sub-info-label">Instagram</div>
                <div class="sub-info-content">
                  <a :href="currentProviderInfo.Links.instagram">
                    {{ currentProviderInfo.Links.instagram }}
                  </a>
                </div>
              </div>
              <div
                class="sub-info"
                v-show="currentProviderInfo.Links.youtube != null"
              >
                <Icon type="logo-youtube" />
                <div class="sub-info-label">Youtube</div>
                <div class="sub-info-content">
                  <a :href="currentProviderInfo.Links.youtube">
                    {{ currentProviderInfo.Links.youtube }}
                  </a>
                </div>
              </div>
              <div
                class="sub-info"
                v-show="currentProviderInfo.Links.twitter != null"
              >
                <Icon type="logo-twitter" />
                <div class="sub-info-label">Twitter</div>
                <div class="sub-info-content">
                  <a :href="currentProviderInfo.Links.twitter">
                    {{ currentProviderInfo.Links.twitter }}
                  </a>
                </div>
              </div>
              <div class="info-footer">
                <Button type="success" @click="approveEventProvider()"
                  >Approve</Button
                >
                <Button
                  type="error"
                  style="margin-left: 1rem"
                  @click="declineEventProvider()"
                  >Decline</Button
                >
              </div>
            </div>
          </Panel>
        </Collapse>
      </div>
      <div v-show="currentPanel === '2'" class="event-provider-pane">
        <div class="sub-title">
          <h2>Pending Events</h2>
          <Button
            icon="md-refresh"
            type="default"
            shape="circle"
            class="refresh-btn"
            @click="getPendingEvents()"
          ></Button>
        </div>
        <Collapse simple accordion @on-change="getEventInfo">
          <Panel
            v-for="(event, index) in pendingEvents"
            :key="index"
            :name="event.providerName+event.title"
          >
            <span class="info-title">{{ event.title }}</span>
            <div slot="content">
              <div class="sub-info">
                <div class="sub-info-label">Provider</div>
                <div class="sub-info-content">
                  {{ currEventInfo.providerName }}
                </div>
              </div>

              <div class="sub-info">
                <div class="sub-info-label">Title</div>
                <div class="sub-info-content">
                  {{ currEventInfo.title }}
                </div>
              </div>
              <div class="sub-info">
                <div class="sub-info-label">Desc</div>
                <div class="sub-info-content">
                  {{ currEventInfo.description }}
                </div>
              </div>
              <div class="sub-info">
                <div class="sub-info-label">Location</div>
                <div class="sub-info-content">
                  {{ currEventInfo.location }}
                </div>
              </div>
              <div class="sub-info">
                <div class="sub-info-label">Date&Time</div>
                <div class="sub-info-content">
                  <span>{{ currEventInfo.dateTime }}</span>
                </div>
              </div>
              <div class="sub-info">
                <div class="sub-info-label">Avialable Tickets</div>
                <div class="sub-info-content">
                  {{ currEventInfo.avialableTickets }}
                </div>
              </div>
              <div class="sub-info">
                <div class="sub-info-label">Single ticket price</div>
                <div class="sub-info-content">
                  {{ currEventInfo.singleTicketPrice }}
                </div>
              </div>
              <div class="sub-info">
                <div class="sub-info-label">Reservation DueDate</div>
                <div class="sub-info-content">
                  <span>{{ currEventInfo.reservationEndDateTime }}</span>
                </div>
              </div>
              <div class="sub-info">
                <div class="sub-info-label">Main category</div>
                <div class="sub-info-content">
                  {{ currEventInfo.mainCategory }}
                </div>
              </div>
              <div class="sub-info">
                <div class="sub-info-label">Sub category</div>
                <div class="sub-info-content">
                  {{ currEventInfo.subCategory }}
                </div>
              </div>
              <div class="sub-info">
                <div class="sub-info-label">Tags</div>
                <div class="sub-info-content">
                  <Tag v-for="tag in currEventInfo.tags" :key="tag">{{
                    tag
                  }}</Tag>
                </div>
              </div>
              <div class="sub-info">
                <div class="sub-info-label">Participants</div>
                <div class="sub-info-content">
                  <div v-if="!soloParticipant">
                    <div style="margin-bottom: 0.5rem">
                      <span style="margin-right: 1rem">Team 1</span>
                      <Tag
                        v-for="participant in team1Participants"
                        :key="participant.name"
                      >
                        {{ participant.name }}
                      </Tag>
                    </div>
                    <div>
                      <span style="margin-right: 1rem">Team 2</span>
                      <Tag
                        v-for="participant in team2Participants"
                        :key="participant.name"
                      >
                        {{ participant.name }}
                      </Tag>
                    </div>
                  </div>
                  <div v-if="soloParticipant">
                    <Tag
                      v-for="participant in currEventInfo.participants"
                      :key="participant.name"
                    >
                      <span>{{ participant.name }}</span>
                      <span style="margin: 0 0.2rem">/</span>
                      <span>{{ participant.role }}</span>
                    </Tag>
                  </div>
                </div>
              </div>
              <div class="info-footer">
                <Button type="success" @click="approveEvent()">Approve</Button>
                <Button
                  type="error"
                  style="margin-left: 1rem"
                  @click="declineEvent()"
                  >Decline</Button
                >
              </div>
            </div>
          </Panel>
        </Collapse>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      currentPanel: "2",
      pendingEventProviderRequests: [],
      pendingEvents: [],
      soloParticipant: false,
      currentProviderInfo: {
        Name: "",
        Email: "",
        Bio: "",
        Links: {
          website: null,
          facebook: null,
          instagram: null,
          youtube: null,
          twitter: null,
        },
      },
      currEventInfo: {
        providerName: "",
        title: "",
        description: "",
        location: "",
        dateTimr: "",
        avialableTickets: "",
        singleTicketPrice: "",
        reservationEndDateTime: "",
        mainCategory: "",
        subCategory: "",
        tags: [],
        participants: [],
      },
    };
  },
  methods: {
    changePane(name) {
      this.currentPanel = name;
    },
    getEventProviderInfo(name) {
      const token = localStorage.getItem("token_admin");
      axios({
        method: "get",
        url: "http://localhost:8888/api/v1/EventProviders/GetSingle",
        params: {
          name: name[0],
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          console.log(response.data.model);
          const eventProvider = response.data.model;
          this.currentProviderInfo.Name = eventProvider.name;
          this.currentProviderInfo.Email = eventProvider.email;
          this.currentProviderInfo.Bio = eventProvider.bio;
          this.currentProviderInfo.Links.website = eventProvider.websiteLink;
          for (const socialLink in eventProvider.socialMedias) {
            if (socialLink.type == "facebook")
              this.currentProviderInfo.Links.facebook = socialLink;
            if (socialLink.type == "instagram")
              this.currentProviderInfo.Links.instagram = socialLink;
            if (socialLink.type == "youtube")
              this.currentProviderInfo.Links.youtube = socialLink;
            if (socialLink.type == "twitter")
              this.currentProviderInfo.Links.twitter = socialLink;
          }
        })
        .catch((error) => console.log(error));
    },
    getPendingEventProviders() {
      const token = localStorage.getItem("token_admin");
      axios({
        method: "get",
        url: "http://localhost:8888/api/v1/EventProviders/GetAll",
        params: {
          pageNumber: 1,
          pageSize: 10,
          searchTarget: null,
          isVerified: false,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          this.pendingEventProviderRequests = response.data.model;
        })
        .catch((error) => console.log(error));
    },
    approveEventProvider() {
      const token = localStorage.getItem("token_admin");
      axios({
        method: "post",
        url: "http://localhost:8888/api/v1/EventProviders/Approve",
        params: {
          name: this.currentProviderInfo.Name,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(() => {
          this.getPendingEventProviders();
        })
        .catch((error) => console.log(error));
    },
    declineEventProvider() {
      const token = localStorage.getItem("token_admin");
      axios({
        method: "post",
        url: "http://localhost:8888/api/v1/EventProviders/Decline",
        params: {
          name: this.currentProviderInfo.Name,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(() => {
          this.getPendingEventProviders();
        })
        .catch((error) => console.log(error));
    },
    getPendingEvents() {
      const token = localStorage.getItem("token_admin");
      axios({
        method: "get",
        url: "http://localhost:8888/api/v1/Events/GetAll",
        params: {
          pageNumber: 1,
          pageSize: 10,
          Query: null,
          ProviderName: null,
          Accepted: false,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          this.pendingEvents = response.data.model;
        })
        .catch((error) => console.log(error));
    },
    getEventInfo(name) {
      const token = localStorage.getItem("token_admin");
      axios({
        method: "get",
        url: "http://localhost:8888/api/v1/Events/GetSingle",
        params: {
          EventID: name[0],
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          const event = response.data.model;
          this.currEventInfo.providerName = event.providerName;
          this.currEventInfo.title = event.title;
          this.currEventInfo.description = event.description;
          this.currEventInfo.location = event.location;
          this.currEventInfo.dateTime = event.dateTime;
          this.currEventInfo.avialableTickets = event.allTickets;
          this.currEventInfo.singleTicketPrice = event.singleTicketPrice;
          this.currEventInfo.reservationEndDateTime = event.reservationDueDate;
          this.currEventInfo.mainCategory = event.category;
          this.currEventInfo.subCategory = event.subCategory;
          this.currEventInfo.tags = event.tags;
          this.currEventInfo.participants = event.participants;

          this.updateShowingParticipants();
        })
        .catch((error) => console.log(error));  
    },
    approveEvent() {
      const token = localStorage.getItem("token_admin");
      axios({
        method: "post",
        url: "http://localhost:8888/api/v1/Events/Accept",
        params: {
          eventId: this.currEventInfo.providerName + this.currEventInfo.title,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(() => {
          this.getPendingEvents();
        })
        .catch((error) => console.log(error));
    },
    declineEvent() {
      const token = localStorage.getItem("token_admin");
      axios({
        method: "post",
        url: "http://localhost:8888/api/v1/Events/Decline",
        params: {
          eventId: this.currEventInfo.providerName + this.currEventInfo.title,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(() => {
          this.getPendingEvents();
        })
        .catch((error) => console.log(error));
    },
    getTeam(teamId) {
      return this.currEventInfo.participants.filter(
        (participant) => participant.team === teamId
      );
    },
    updateShowingParticipants() {
      if (
        this.currEventInfo.mainCategory == "Entertainment" ||
        this.currEventInfo.mainCategory == "Education"
      ) {
        this.soloParticipant = true;
      } else if (this.currEventInfo.mainCategory == "Sports") {
        this.soloParticipant = false;
      }
    }
  },
  computed: {
    team1Participants: function () {
      return this.getTeam(1);
    },
    team2Participants: function () {
      return this.getTeam(2);
    },
  },
  mounted() {
    this.getPendingEventProviders();
    this.getPendingEvents();
  },
};
</script>

<style scoped>
.admin-panel {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.header {
  padding: 0.5rem 0rem;
  text-align: center;
  background-color: whitesmoke;
  color: #161616;
}
.main {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
}
.event-provider-pane {
  height: 100%;
  width: 100%;
  padding: 1rem;
}
.sub-title {
  display: flex;
  margin-bottom: 1rem;
}
.refresh-btn {
  margin-left: auto;
}
.sub-info {
  min-height: 2rem;
  height: fit-content;
  display: flex;
  align-items: center;
  font-size: small;
}
.sub-info-label {
  width: 10%;
  margin-left: 0.4rem;
  font-weight: bold;
}
.sub-info-content {
  height: fit-content;
  width: 85%;
}
.info-title {
  font-weight: bold;
  font-size: 0.9rem;
}
.info-footer {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
}
</style>
