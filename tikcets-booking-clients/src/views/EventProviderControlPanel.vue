<template>
  <div class="control-panel">
    <div class="header">
      <h1 class="header-title">Tazkara</h1>
      <Button type="primary" class="new-event-btn" @click="goToNewEventpage"
        >Create New Event</Button
      >
    </div>
    <div class="main">
      <Menu
        theme="light"
        :active-name="currentPanel"
        class="menu"
        @on-select="changePane"
      >
        <MenuItem name="1">
          <Icon type="md-briefcase" />
          Pending Events
        </MenuItem>
        <MenuItem name="2">
          <Icon type="ios-navigate" />
          Active Events
        </MenuItem>
      </Menu>
      <div v-show="currentPanel === '1'" class="control-pane">
        <div class="sub-title">
          <Badge type="warning" :text="getPendingEventsNumber()">
            <h2 style="padding-right: 0.5rem">Pending Events</h2>
          </Badge>

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
            :name="event.title"
          >
            <span class="info-title">{{ event.title }}</span>
            <div slot="content">
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
            </div>
          </Panel>
        </Collapse>
      </div>
      <div v-show="currentPanel === '2'" class="control-pane">
        <div class="sub-title">
          <h2>Active Events</h2>
          <Button
            icon="md-refresh"
            type="default"
            shape="circle"
            class="refresh-btn"
            @click="getActiveEvents()"
          ></Button>
        </div>
        <Collapse simple accordion @on-change="getEventInfo">
          <Panel
            v-for="(event, index) in activeEvents"
            :key="index"
            :name="event.title"
          >
            <span class="info-title">{{ event.title }}</span>
            <div slot="content">
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
      currentPanel: "1",
      pendingEvents: [],
      activeEvents: [],
      soloParticipant: false,
      currEventInfo: {
        title: "",
        description: "",
        location: "",
        dateTime: "",
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
    getPendingEvents() {
      const token = localStorage.getItem("token");
      const name = localStorage.getItem("name");
      axios({
        method: "get",
        url: "http://localhost:8888/api/v1/Events/GetAll",
        params: {
          pageNumber: 1,
          pageSize: 10,
          Query: null,
          ProviderName: name,
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
    getActiveEvents() {
      const token = localStorage.getItem("token");
      const name = localStorage.getItem("name");
      axios({
        method: "get",
        url: "http://localhost:8888/api/v1/Events/GetAll",
        params: {
          pageNumber: 1,
          pageSize: 10,
          Query: null,
          ProviderName: name,
          Accepted: true,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          this.activeEvents = response.data.model;
        })
        .catch((error) => console.log(error));
    },
    getEventInfo(name) {
      const token = localStorage.getItem("token");
      const providerName = localStorage.getItem("name");
      axios({
        method: "get",
        url: "http://localhost:8888/api/v1/Events/GetSingle",
        params: {
          EventID: providerName+name[0],
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          const event = response.data.model;
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
    getTeam(teamId) {
      return this.currEventInfo.participants.filter(
        (participant) => participant.team === teamId
      );
    },
    getPendingEventsNumber() {
      return String(this.pendingEvents.length);
    },
    goToNewEventpage() {
      this.$router.push("create-new-event");
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
    this.getPendingEvents();
    this.getActiveEvents();
  },
};
</script>

<style scoped>
.control-panel {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.header {
  display: grid;
  justify-items: center;
  align-items: center;
  grid-template-columns: repeat(5, 20%);
  padding: 0.5rem 0rem;
  text-align: center;
  background-color: whitesmoke;
  color: #161616;
}
.header-title {
  grid-column: 3;
}
.new-event-btn {
  grid-column: 5;
  margin-left: auto;
  margin-right: 0.5rem;
  height: 2rem;
}
.main {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
}
.control-pane {
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
</style>
