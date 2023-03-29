<template>
  <div class="Home">
    <div id="refund-confirm-container" v-show="controls.showRefundConfirm">
      <div id="refund-confrim">
        <div style="margin-bottom: 1rem; font-size: 1.6rem; font-weight: bold">
          Are you sure to refund?
        </div>
        <div id="refund-row">
          <div
            id="cancel-refund-btn"
            @click="controls.showRefundConfirm = false"
          >
            Cancel
          </div>
          <div id="confirm-refund-btn" @click="confirmRefund()">Confrim</div>
        </div>
      </div>
    </div>
    <div
      class="purchase-dialog-container"
      :class="{ 'hide-purchase-dialog': !controls.showPurchaseDialog }"
    >
      <div id="purchase-dialog">
        <div class="purchase-dialog-row">
          <div class="purchase-dialog-label">Number of Tickets</div>
          <input
            type="text"
            class="purchase-dialog-input"
            v-model="purchaseInfo.ticketsNo"
          />
        </div>
        <div
          class="ticket-error-warning"
          :class="{ 'hide-tickets-error': !controls.showTicketsError }"
        >
          Not enough Tickets
        </div>
        <div class="purchase-dialog-row">
          <div class="purchase-dialog-label">Credit card No.</div>
          <input
            type="text"
            class="purchase-dialog-input"
            v-model="purchaseInfo.creditNo"
          />
        </div>
        <div class="purchase-dialog-row">
          <div class="purchase-dialog-label" style="font-size: 1.5rem">
            Total
            <span style="font-weight: bolder; margin-left: 1rem">{{
              purchaseInfo.ticketsNo * purchaseInfo.singleTicketPrice
            }}</span>
          </div>
        </div>
        <div class="purchase-dialog-row">
          <div id="cancel-purchase-btn" @click="cancelPurchaseDialog()">
            Cancel
          </div>
          <div id="verify-purchase-btn" @click="verifyPurchase()">Purchase</div>
        </div>
      </div>
    </div>
    <div
      class="purchase-list-container"
      :class="{ 'hide-purchase-list': !controls.showPurchaseList }"
    >
      <div id="purchase-list">
        <div id="purchase-list-header">
          <div
            class="purchase-list-nav-btn"
            :class="{
              'purchase-list-nav-btn-selected': controls.showUpComingEvents,
            }"
            @click="getAllNotPassedPurchases()"
          >
            Up Coming
          </div>
          <div
            class="purchase-list-nav-btn"
            :class="{
              'purchase-list-nav-btn-selected': controls.showPastEvents,
            }"
            @click="getAllPassedPurchases()"
          >
            Past
          </div>
          <div class="cancel-dialog-btn" @click="closePurchaseList()">❌</div>
        </div>
        <div id="purchase-list-items">
          <div
            class="purchase-card"
            v-for="purchase in purchasesList"
            :key="purchase.purchaseID"
          >
            <div class="purchase-card-col-1">
              <div>{{ purchase.ticketCount }} tickets</div>
              <div>{{ purchase.singleTicketCost }} <span>EGP/ticket</span></div>
            </div>
            <div class="purchase-card-col-2">
              <div>{{ purchase.purchaseID }}</div>
              <div>{{ purchase.reservationDate }}</div>
            </div>
            <div
              class="refund-btn"
              v-show="controls.showUpComingEvents"
              @click="startRefund(purchase.purchaseID)"
            >
              Re-fund
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="event-dialog-container"
      :class="{ 'hide-event-dialog': !controls.showEventDialog }"
    >
      <div id="event-dialog">
        <div id="event-dialog-header">
          <div
            class="event-category-badge"
            :class="setEventDialogCategoryClass(currentEvent.category)"
          >
            {{ currentEvent.category }}
          </div>
          <div class="event-sub-category">
            {{ getSubCategoryLabel(currentEvent.subCategory) }}
          </div>
          <div class="cancel-dialog-btn" @click="closeEventDialog()">❌</div>
        </div>
        <div id="event-dialog-main-1">
          <div id="event-main-info">
            <div id="dialog-event-title">{{ currentEvent.title }}</div>
            <div id="dialog-event-loc">
              <span class="dialog-icon">🧭</span> {{ currentEvent.location }}
            </div>
            <div id="dialog-event-datetime">
              <span class="dialog-icon">🗓</span>
              <span>{{ formatDateTime(currentEvent.dateTime)[0] }}</span>
              <span>{{ formatDateTime(currentEvent.dateTime)[1] }}</span>
            </div>
            <div id="dialog-event-provider">
              <span style="font-weight: bold">Event Provider</span>
              {{ currentEvent.providerName.toUpperCase() }}
            </div>
          </div>
          <div
            id="event-desc"
            :class="getEventProviderDescFrame(currentEvent.category)"
          >
            <div id="event-desc-inner">
              {{ currentEvent.description }}
            </div>
          </div>
        </div>
        <div
          id="event-dialog-purchase"
          :class="setEventCartBelowClass(currentEvent.category)"
        >
          <div id="event-dialog-price">
            {{ currentEvent.singleTicketPrice }} <span>EGP</span>
          </div>
          <div id="event-dialog-remaining-tickets">
            <span style="font-weight: bold">{{
              currentEvent.allTickets - currentEvent.boughtTickets
            }}</span>
            avialable /
            <span style="font-weight: bold">{{ currentEvent.allTickets }}</span>
          </div>
          <div
            id="event-dialog-get-tickets"
            @click="
              purchaseEvent(
                currentEvent.singleTicketPrice,
                currentEvent.eventId
              )
            "
          >
            Get Yours Now!✨
          </div>
        </div>
      </div>
    </div>
    <Row id="header">
      <div id="user-badge" @click="showUserPurchases()">My Purchases</div>
      <div id="header-title">Tazkara</div>
      <div id="auth-btns">
        <div class="user-auth-btn" @click="goToEventProviderLogin()">
          Event Provider
        </div>
        <div class="user-auth-btn" @click="goToCustomerSignin()">Customer</div>
      </div>
    </Row>
    <Row id="show-panel">
      <div id="show-panel-layer-below"></div>
      <div id="show-panel-layer-above">
        <div id="show-panel-title">Don't Miss 🔥</div>
        <div id="show-container">
          <div
            class="event-card"
            v-for="event in donnotMissEvents"
            :key="event.eventID"
          >
            <div
              class="event-card-below"
              :class="setEventCartBelowClass(event.category)"
            ></div>
            <div class="event-card-above">
              <div class="event-title" @click="showEvent(event.eventID)">
                {{ event.title }}
              </div>
              <div class="event-category">
                <div
                  class="event-category-badge"
                  :class="setEventCardCategoryClass(event.category)"
                >
                  {{ event.category }}
                </div>
                <div class="event-sub-category">
                  {{ getSubCategoryLabel(event.subCategory) }}
                </div>
              </div>
              <div class="event-date">
                {{ formatDateTime(event.dateTime)[0] }}
              </div>
              <div class="event-purchase">
                <div class="event-price">
                  {{ event.singleTicketPrice }} <span>EGP</span>
                </div>
                <div
                  class="event-buy"
                  @click="purchaseEvent(event.singleTicketPrice, event.eventID)"
                >
                  Get✨
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Row>
    <Row id="moto">
      <div>Choose Your next FUN 🎉</div>
    </Row>
    <Row id="main">
      <div id="side-bar">
        <div id="search-area">
          <input type="text" id="search-bar" v-model="searchTarget" />
          <div id="search-btn" @click="searchEvents()">Search</div>
        </div>

        <div id="filter-control">
          <div class="filter-control-btn" @click="filterEvents()">
            Apply Filter
          </div>
        </div>
        <div class="filter-title">Category</div>
        <div id="category-container">
          <div>
            <div
              class="category-btn all-btn"
              :class="{ 'all-btn-selected': showAll }"
              @click="toggleAllCategories()"
            >
              All
            </div>
          </div>
          <div
            class="category-btn entertainment-btn"
            :class="{ 'entertainment-btn-selected': category.entertainment }"
            @click="toggleCategory('entertainment')"
          >
            Entertainment
          </div>
          <div>
            <div class="sub-category-container">
              <Checkbox
                :disabled="!category.entertainment"
                v-model="subCategory.entertainment.movies"
                class="sub-cat-checkbox"
              >
                <span class="sub-cat-label">Movies 🍿</span>
              </Checkbox>
              <Checkbox
                :disabled="!category.entertainment"
                v-model="subCategory.entertainment.theatre"
                class="sub-cat-checkbox"
              >
                <span class="sub-cat-label">Theatre 🎭</span>
              </Checkbox>
              <Checkbox
                :disabled="!category.entertainment"
                v-model="subCategory.entertainment.concerts"
                class="sub-cat-checkbox"
              >
                <span class="sub-cat-label">Concerts 🎻</span>
              </Checkbox>
              <Checkbox
                :disabled="!category.entertainment"
                v-model="subCategory.entertainment.standup"
                class="sub-cat-checkbox"
              >
                <span class="sub-cat-label">Standup show 🎤</span>
              </Checkbox>
            </div>
          </div>
          <div>
            <div
              class="category-btn edu-btn"
              :class="{ 'edu-btn-selected': category.education }"
              @click="toggleCategory('education')"
            >
              Education
            </div>
            <div class="sub-category-container">
              <Checkbox
                :disabled="!category.education"
                v-model="subCategory.education.conference"
                class="sub-cat-checkbox"
              >
                <span class="sub-cat-label">Conference 🤓</span>
              </Checkbox>
              <Checkbox
                :disabled="!category.education"
                v-model="subCategory.education.fair"
                class="sub-cat-checkbox"
              >
                <span class="sub-cat-label">Fair 🧠</span>
              </Checkbox>
            </div>
          </div>
          <div>
            <div
              class="category-btn sports-btn"
              :class="{ 'sports-btn-selected': category.sports }"
              @click="toggleCategory('sports')"
            >
              Sports
            </div>
            <div class="sub-category-container">
              <Checkbox
                :disabled="!category.sports"
                v-model="subCategory.sports.football"
                class="sub-cat-checkbox"
              >
                <span class="sub-cat-label">Football ⚽️</span>
              </Checkbox>
              <Checkbox
                :disabled="!category.sports"
                v-model="subCategory.sports.tennis"
                class="sub-cat-checkbox"
              >
                <span class="sub-cat-label">Tennis 🎾</span>
              </Checkbox>
              <Checkbox
                :disabled="!category.sports"
                v-model="subCategory.sports.basketball"
                class="sub-cat-checkbox"
              >
                <span class="sub-cat-label">Basketball 🏀</span>
              </Checkbox>
              <Checkbox
                :disabled="!category.sports"
                v-model="subCategory.sports.volleyball"
                class="sub-cat-checkbox"
              >
                <span class="sub-cat-label">Volleyball 🏐</span>
              </Checkbox>
            </div>
          </div>
        </div>
      </div>
      <div id="main-show-panel">
        <div id="search-warning" v-show="controls.showSearchWarning">
          No Matching Events🙁
        </div>
        <div
          class="event-card"
          v-for="event in panelEvents"
          :key="event.eventID"
        >
          <div
            class="event-card-below"
            :class="setEventCartBelowClass(event.category)"
          ></div>
          <div class="event-card-above">
            <div class="event-title" @click="showEvent(event.eventID)">
              {{ event.title }}
            </div>
            <div class="event-category">
              <div
                class="event-category-badge"
                :class="setEventCardCategoryClass(event.category)"
              >
                {{ event.category }}
              </div>
              <div class="event-sub-category">
                {{ getSubCategoryLabel(event.subCategory) }}
              </div>
            </div>
            <div class="event-date">
              {{ formatDateTime(event.dateTime)[0] }}
            </div>
            <div class="event-purchase">
              <div class="event-price">
                {{ event.singleTicketPrice }} <span>EGP</span>
              </div>
              <div
                class="event-buy"
                @click="purchaseEvent(event.singleTicketPrice, event.eventID)"
              >
                Get✨
              </div>
            </div>
          </div>
        </div>
      </div>
    </Row>
    <Row class="info">
      <div class="sub-header">Our mission</div>
      <div class="body">
        <p>
          We aim to close the gap between the event provider and the customers
        </p>
        <p>
          Customers can search a variety of events and choose events, book
          tickets
        </p>
        <p>Be a partner in our mission to stream line the process</p>
      </div>
      <div
        class="user-auth-btn"
        id="info-join"
        @click="goToEventProviderLogin()"
      >
        Join US
      </div>
    </Row>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Home",
  components: {},
  data() {
    return {
      controls: {
        showEventDialog: false,
        showPurchaseDialog: false,
        showTicketsError: false,
        showPurchaseList: false,
        showUpComingEvents: true,
        showPastEvents: false,
        showSearchWarning: false,
        showRefundConfirm: false,
      },
      showAll: true,
      category: {
        entertainment: true,
        sports: true,
        education: true,
      },
      subCategory: {
        entertainment: {
          movies: true,
          theatre: true,
          concerts: true,
          standup: true,
        },
        education: {
          conference: true,
          fair: true,
        },
        sports: {
          football: true,
          tennis: true,
          basketball: true,
          volleyball: true,
        },
      },
      donnotMissEvents: [],
      currentEvent: {
        eventID: "",
        title: "",
        description: "",
        providerName: "",
        dateTime: "",
        allTickets: 0,
        singleTicketPrice: 0,
        reservationDueDate: "",
        location: "",
        category: "",
        subCategory: "",
        boughtTickets: 0,
      },
      purchaseInfo: {
        ticketsNo: "",
        creditNo: "",
        singleTicketPrice: 0,
        eventID: 0,
      },
      searchTarget: "",
      panelEvents: [],
      purchasesList: [],
      currentPurchaseID: null,
    };
  },
  methods: {
    goToEventProviderLogin() {
      this.$router.push("event-provider-login");
    },
    goToCustomerSignin() {
      this.$router.push("customer-login");
    },
    toggleAllCategories() {
      this.showAll = !this.showAll;
      this.category.entertainment = this.showAll;
      this.subCategory.entertainment.movies = this.showAll;
      this.subCategory.entertainment.theatre = this.showAll;
      this.subCategory.entertainment.concerts = this.showAll;
      this.subCategory.entertainment.standup = this.showAll;

      this.category.sports = this.showAll;
      this.subCategory.sports.football = this.showAll;
      this.subCategory.sports.tennis = this.showAll;
      this.subCategory.sports.volleyball = this.showAll;
      this.subCategory.sports.basketball = this.showAll;

      this.category.education = this.showAll;
      this.subCategory.education.conference = this.showAll;
      this.subCategory.education.fair = this.showAll;
    },
    toggleCategory(targetCategory) {
      this.category[targetCategory] = !this.category[targetCategory];
      for (const subCategoryVal in this.subCategory[targetCategory]) {
        this.subCategory[targetCategory][subCategoryVal] =
          this.category[targetCategory];
      }
    },
    showEvent(eventID) {
      this.controls.showEventDialog = true;
      this.getSingleEventInfo(eventID);
    },
    closeEventDialog() {
      this.controls.showEventDialog = false;
      this.controls.showPurchaseDialog = false;
    },
    purchaseEvent(singleTicketPrice, eventID) {
      this.controls.showPurchaseDialog = true;
      this.purchaseInfo.singleTicketPrice = singleTicketPrice;
      this.getSingleEventInfo(eventID);
    },
    setEventCardCategoryClass(category) {
      if (category.toLowerCase() == "entertainment")
        return "entertainment-category";
      if (category.toLowerCase() == "education") return "edu-category";
      return "sports-category";
    },
    setEventCartBelowClass(category) {
      if (category.toLowerCase() == "entertainment")
        return "below-entertainment";
      if (category.toLowerCase() == "education") return "below-edu";
      return "below-sports";
    },
    setEventDialogCategoryClass(category) {
      if (category.toLowerCase() == "entertainment")
        return "dialog-entertainment-category";
      if (category.toLowerCase() == "education") return "dialog-edu-category";
      return "dialog-sports-category";
    },
    getEventProviderDescFrame(category) {
      if (category.toLowerCase() == "entertainment")
        return "entertainment-desc-frame";
      if (category.toLowerCase() == "education") return "edu-desc-frame";
      return "sports-desc-frame";
    },
    getSubCategoryLabel(subCategory) {
      if (subCategory.toLowerCase() == "movie") return "Movies 🍿";
      if (subCategory.toLowerCase() == "theatre") return "Theatre 🎭";
      if (subCategory.toLowerCase() == "concert") return "Concert 🎻";
      if (subCategory.toLowerCase() == "standup show") return "Standup 🎤";
      if (subCategory.toLowerCase() == "conference") return "Conference 🤓";
      if (subCategory.toLowerCase() == "fair") return "Fair 🧠";
      if (subCategory.toLowerCase() == "football") return "Football ⚽️";
      if (subCategory.toLowerCase() == "tennis") return "Tennis 🎾";
      if (subCategory.toLowerCase() == "basketball") return "Basketball 🏀";
      if (subCategory.toLowerCase() == "volleyball") return "Volleyball 🏐";
    },
    closePurchaseList() {
      this.controls.showPurchaseList = false;
      this.controls.showPastEvents = false;
      this.controls.showUpComingEvents = true;
    },
    getDonnotMissEvents() {
      axios({
        method: "get",
        url: "http://localhost:8888/api/v1/Events/GetNearlyFinished",
        params: {
          numberOfEventsNeeded: 10,
        },
      })
        .then((response) => {
          this.donnotMissEvents = response.data.model;
        })
        .catch((error) => console.log(error));
    },
    getSingleEventInfo(eventID) {
      axios({
        method: "get",
        url: "http://localhost:8888/api/v1/Events/GetSingle",
        params: {
          eventID: eventID,
        },
      })
        .then((response) => {
          this.currentEvent = response.data.model;
        })
        .catch((error) => console.log(error));
    },
    formatDateTime(dateTime) {
      return dateTime.split("T");
    },
    verifyPurchase() {
      const available =
        this.currentEvent.allTickets - this.currentEvent.boughtTickets;
      if (this.purchaseInfo.ticketsNo > available) {
        this.controls.showTicketsError = true;
        return;
      }

      const purchaseForm = new FormData();
      purchaseForm.append("CustomerID", localStorage.getItem("customer_id"));
      purchaseForm.append("EventId", this.currentEvent.eventID);
      purchaseForm.append("TicketsCount", this.purchaseInfo.ticketsNo);
      const token = localStorage.getItem("token");

      axios({
        method: "post",
        url: "http://localhost:8888/api/v1/Purchases/Create",
        data: purchaseForm,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          console.log(response.data.model);
          this.controls.showPurchaseDialog = false;
          this.purchaseInfo.ticketsNo = "";
          this.purchaseInfo.creditNo = "";
          this.getSingleEventInfo(this.currentEvent.eventID);
        })
        .catch((error) => console.log(error));
    },
    cancelPurchaseDialog() {
      this.controls.showTicketsError = false;
      this.controls.showPurchaseDialog = false;
      this.purchaseInfo.ticketsNo = "";
      this.purchaseInfo.creditNo = "";
    },
    searchEvents() {
      if (this.searchTarget == "") return;
      axios({
        method: "get",
        url: "http://localhost:8888/api/v1/Events/Search",
        params: {
          query: this.searchTarget,
        },
      })
        .then((response) => {
          this.panelEvents = response.data.model;
          if (this.panelEvents.length == 0)
            this.controls.showSearchWarning = true;
          else this.controls.showSearchWarning = false;
        })
        .catch((error) => console.log(error));
    },
    filterEvents() {
      const filterTags = [];
      if (this.subCategory.entertainment.movies) filterTags.push("movie");
      if (this.subCategory.entertainment.theatre) filterTags.push("theatre");
      if (this.subCategory.entertainment.concerts) filterTags.push("concert");
      if (this.subCategory.entertainment.standup)
        filterTags.push("standup show");

      if (this.subCategory.sports.football) filterTags.push("football");
      if (this.subCategory.sports.tennis) filterTags.push("tennis");
      if (this.subCategory.sports.basketball) filterTags.push("basketball");
      if (this.subCategory.sports.volleyball) filterTags.push("volleyball");

      if (this.subCategory.education.conference) filterTags.push("conference");
      if (this.subCategory.education.fair) filterTags.push("fair");

      if (filterTags.length == 0) return;
      const filterTarget = filterTags.toString().replace(/,/g, " ");

      axios({
        method: "get",
        url: "http://localhost:8888/api/v1/Events/Search",
        params: {
          query: filterTarget,
        },
      })
        .then((response) => {
          this.panelEvents = response.data.model;
          if (this.panelEvents.length == 0)
            this.controls.showSearchWarning = true;
          else this.controls.showSearchWarning = false;
        })
        .catch((error) => console.log(error));
    },
    showUserPurchases() {
      this.controls.showPurchaseList = true;
      this.getAllNotPassedPurchases();
    },
    getAllNotPassedPurchases() {
      this.controls.showUpComingEvents = true;
      this.controls.showPastEvents = false;

      axios({
        method: "get",
        url: "http://localhost:8888/api/v1/Purchases/GetAllNotPassed",
        params: {
          customerID: localStorage.getItem("customer_id"),
        },
      })
        .then((response) => {
          this.purchasesList = response.data.model;
        })
        .catch((error) => console.log(error));
    },
    getAllPassedPurchases() {
      this.controls.showUpComingEvents = false;
      this.controls.showPastEvents = true;

      axios({
        method: "get",
        url: "http://localhost:8888/api/v1/Purchases/GetAllPassed",
        params: {
          customerID: localStorage.getItem("customer_id"),
        },
      })
        .then((response) => {
          this.purchasesList = response.data.model;
        })
        .catch((error) => console.log(error));
    },
    startRefund(purchaseID) {
      this.controls.showRefundConfirm = true;
      this.currentPurchaseID = purchaseID;
    },
    confirmRefund() {
      const refundFormData = new FormData();
      refundFormData.append("purchaseID", this.currentPurchaseID);

      axios({
        method: "post",
        url: "http://localhost:8888/api/v1/Purchases/Refund",
        data: refundFormData,
      })
        .then((response) => {
          console.log(response.data.model);
          this.controls.showRefundConfirm = false;
          this.getAllNotPassedPurchases(); //refresh
        })
        .catch((error) => console.log(error));
    },
  },
  mounted() {
    this.getDonnotMissEvents();
    this.filterEvents();
  },
};
</script>

<style scoped>
.Home {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #121212;
  padding: 3rem;
  color: white;
  clip-path: polygon(0 0, 100% 20%, 100% 100%, 0 80%);
  margin-top: auto;
}
#info-join {
  margin-top: 1rem;
  font-weight: bold;
  font-size: medium;
}
#info-join:hover {
  border: 1px solid white;
  transition: background-color 0.3s ease;
}

#header {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  justify-items: center;
  align-items: center;
  margin: 0.5rem 0rem;
  color: #121212;
}
#header-title {
  grid-column: 3/5;
  font-size: 2rem;
  font-weight: bold;
}
#auth-btns {
  grid-column: 5/7;
  display: flex;
  text-align: center;
}
#user-badge {
  grid-column: 1/2;
  width: 7rem;
  height: 2rem;
  border: 2px solid #121212;
  border-radius: 0.4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 3px;
  cursor: pointer;
  margin-right: auto;
  margin-left: 2rem;
}
#user-badge:hover {
  background-color: #121212;
  color: white;
  transition: background-color 0.3s ease;
}
.user-auth-btn {
  width: 7rem;
  height: 2rem;
  border-radius: 0.3rem;
  border: 1px solid #121212;
  background-color: white;
  color: #121212;
  text-align: center;
  line-height: 2rem;
  margin: 0rem 0.5rem;
  font-size: 0.8rem;
  user-select: none;
  cursor: pointer;
}
.user-auth-btn:hover {
  background-color: #121212;
  color: white;
  transition: background-color 0.3s ease;
}

#show-panel {
  padding: 1rem 2rem;
  display: grid;
}
#show-panel-title {
  font-size: 1.7rem;
  font-weight: bold;
  color: #121212;
}
#show-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 0.3rem;
  width: 88rem;
  overflow-x: scroll;
}
#show-container::-webkit-scrollbar {
  display: none;
}
.event-card {
  display: grid;
  border-radius: 0.5rem;
  border: 1px solid #121212;
  background-color: white;
  width: 15rem;
  height: 17rem;
  margin-right: 1.5rem;
  margin-bottom: 1rem;
  flex: none;
}
.event-card:hover {
  box-shadow: 7px 7px 9px -5px #121212c7;
  transition: background-color 0.3s ease;
}
.event-card-below,
.event-card-above {
  grid-area: 1/1;
}
.event-card-below {
  margin-top: 11.2rem;
  height: 5.7rem;
  border-radius: 0.44rem;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  clip-path: polygon(0 0, 100% 35%, 100% 100%, 0% 100%);
  z-index: 1;
}
.below-entertainment {
  background-color: #ff6767c2;
}
.below-sports {
  background-color: #61d6a4;
}
.below-edu {
  background-color: #59a4ff;
}
.event-card-above {
  padding: 1rem;
  z-index: 2;
}

.event-title {
  height: 8.5rem;
  font-size: 1.9rem;
  font-weight: bold;
  color: #121212;
  cursor: default;
}
.event-category {
  height: 2rem;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.event-category-badge {
  height: 1.7rem;
  text-align: center;
  padding: 0rem 0.3rem;
  line-height: 1.6rem;
  border-radius: 0.8rem;
  font-size: 0.8rem;
  user-select: none;
  margin-right: 0.5rem;
  font-weight: bold;
}
.entertainment-category {
  /* border: 1px solid #da1212; */
  color: #da1212;
}
.edu-category {
  color: #1c6dd0;
}
.sports-category {
  color: #34be82;
}

.event-sub-category {
  height: 1.7rem;
  text-align: center;
  padding: 0rem 0.5rem;
  line-height: 1.6rem;
  border-radius: 0.8rem;
  font-size: 0.8rem;
  user-select: none;
  margin-right: 0.5rem;
  border: 1px solid #121212;
  color: #121212;
}
.event-date {
  color: #121212;
  font-size: medium;
  height: 1.5rem;
  margin: 0.3rem 0rem;
}
.event-purchase {
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  height: 2.2rem;
}
.event-price {
  height: 2rem;
  line-height: 2rem;
  font-size: 1.6rem;
  color: #121212;
}
.event-buy {
  height: 2rem;
  border-radius: 0.4rem;
  width: 5rem;
  border: 1px solid #121212;
  color: #121212;
  font-size: 1.3rem;
  margin-left: auto;
  text-align: center;
  line-height: 1.9rem;
  user-select: none;
  z-index: 5;
}
.event-buy:hover {
  background-color: #121212;
  color: white;
  transition: background-color 0.3s ease;
}

#show-panel-layer-above,
#show-panel-layer-below {
  grid-area: 1/1;
}
#show-panel-layer-below {
  width: 100%;
  height: 100%;
  background-color: #fcba5f;
  clip-path: polygon(0 0, 100% 30%, 100% 100%, 0 70%);
  z-index: -1;
  margin-top: 0.7rem;
}
#show-panel-layer-above {
  width: 100%;
  padding-bottom: 1rem;
}

#moto {
  font-size: 2rem;
  font-weight: bold;
  color: #121212;
  display: flex;
  justify-content: center;
  margin: 1rem 0rem;
}

#main {
  display: flex;
  flex-direction: row;
}

#side-bar {
  flex: 0.2;
  padding: 1rem;
  padding-top: 0rem;
}

#main-show-panel {
  flex: 0.8;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

#filter-control {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 1rem;
}

.filter-title {
  font-size: large;
  color: #121212;
  font-weight: bold;
}

#category-container {
  margin-left: 1rem;
}

.category-btn {
  height: 1.7rem;
  width: 8rem;
  text-align: center;
  line-height: 1.6rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  user-select: none;
}

.sub-category-container {
  display: flex;
  flex-direction: column;
  color: #121212;
  margin-top: 0.2rem;
  margin-left: 0.5rem;
}
.sub-cat-checkbox {
  padding: 0.1rem 0rem;
}
.sub-cat-label {
  font-size: 0.85rem;
}

.entertainment-btn {
  border: 1px solid #da1212;
  color: #da1212;
}
.entertainment-btn-selected {
  background-color: #da1212;
  color: white;
}

.sports-btn {
  border: 1px solid #34be82;
  color: #34be82;
}
.sports-btn-selected {
  background-color: #34be82;
  color: white;
}

.edu-btn {
  border: 1px solid #1c6dd0;
  color: #1c6dd0;
}
.edu-btn-selected {
  background-color: #1c6dd0;
  color: white;
}

.all-btn {
  border: 1px solid #121212;
  color: #121212;
}
.all-btn-selected {
  background-color: #121212;
  color: white;
}

.filter-control-btn {
  border: 1px solid #121212;
  border-radius: 0.4rem;
  width: 10rem;
  height: 2rem;
  text-align: center;
  line-height: 2rem;
  font-size: 0.85rem;
  color: #121212;
  user-select: none;
}
.filter-control-btn:hover {
  background-color: #121212;
  color: white;
  transition: background-color 0.3s ease;
}

.sub-header {
  font-size: 1.7rem;
}
.body {
  font-size: large;
  text-align: center;
}

#search-area {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}
#search-bar[type="text"] {
  height: 2rem;
  border: 1px solid #121212;
  border-radius: 0.3rem;
  box-sizing: border-box;
  width: 65%;
  outline: none;
  padding-left: 0.5rem;
  font-size: 0.9rem;
  color: #121212;
  margin-right: 1rem;
}
#search-bar:focus {
  border: 1px solid #121212;
}

#search-btn {
  height: 2rem;
  width: 4.5rem;
  background-color: #121212;
  color: white;
  border-radius: 0.4rem;
  text-align: center;
  line-height: 2rem;
  user-select: none;
  font-size: 0.9rem;
  font-weight: bold;
}

.event-dialog-container {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(3px);
  z-index: 10;
}
.hide-event-dialog {
  display: none;
}
#event-dialog {
  background-color: rgb(250, 250, 250);
  width: 60%;
  /* height: 80%; */
  height: 55%;
  border-radius: 1rem;
  border: 1px solid #121212;
  display: flex;
  flex-direction: column;
}
#event-dialog-header {
  display: flex;
  height: 1.7rem;
  justify-content: flex-start;
  align-items: center;
  margin-top: 1rem;
  margin-left: 1rem;
  margin-right: 1rem;
}
.cancel-dialog-btn {
  margin-left: auto;
  font-size: large;
  user-select: none;
  cursor: pointer;
}
.dialog-entertainment-category {
  border: 1px solid #da1212;
  color: #da1212;
}
.dialog-sports-category {
  border: 1px solid #34be82;
  color: #34be82;
}
.dialog-edu-category {
  border: 1px solid #1c6dd0;
  color: #1c6dd0;
}
#event-dialog-main-1 {
  display: flex;
  width: 100%;
  margin-top: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
}
#event-main-info {
  width: 50%;
  margin-right: 0.5rem;
}
#event-desc {
  width: 50%;
  padding: 1.2rem;
  color: #121212;
  font-size: medium;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  border-width: 3px 4px 3px 5px;
  border-radius: 95% 4% 92% 5%/4% 95% 6% 95%;
  transform: rotate(2deg);
}
.entertainment-desc-frame {
  border: solid #da1212;
}
.edu-desc-frame {
  border: solid #1c6dd0;
}
.sports-desc-frame {
  border: solid #34be82;
}
#event-desc-inner {
  transform: rotate(-2deg);
  overflow-y: scroll;
  max-height: 14rem;
}
#event-desc-inner::-webkit-scrollbar {
  display: none;
}
#dialog-event-title {
  color: #121212;
  font-weight: bold;
  font-size: 2.2rem;
  margin-bottom: 1rem;
}
#dialog-event-loc,
#dialog-event-datetime,
#dialog-event-provider {
  font-size: 1rem;
  color: #121212;
  margin-top: 0.4rem;
}
.dialog-icon {
  width: 1rem;
  margin-right: 0.4rem;
}
#event-dialog-purchase {
  padding: 1rem;
  padding-bottom: 1.7rem;
  margin-top: auto;
  height: 8rem;
  border-bottom-left-radius: 0.88rem;
  border-bottom-right-radius: 0.88rem;
  clip-path: polygon(0 0, 100% 30%, 100% 100%, 0% 100%);
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
}
#event-dialog-price {
  height: 2.5rem;
  line-height: 2.4rem;
  font-size: 1.6rem;
  color: #121212;
}
#event-dialog-get-tickets {
  height: 2.5rem;
  border-radius: 0.4rem;
  width: 12rem;
  border: 1px solid #121212;
  color: #121212;
  font-size: 1.3rem;
  margin-left: auto;
  text-align: center;
  line-height: 2.4rem;
  user-select: none;
}
#event-dialog-get-tickets:hover {
  background-color: #121212;
  color: white;
  transition: background-color 0.3s ease;
}
#event-dialog-remaining-tickets {
  height: 2srem;
  color: #121212;
  font-size: 1.1rem;
  line-height: 2rem;
  margin-left: 2rem;
}

.purchase-dialog-container {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 14;
}
.hide-purchase-dialog {
  display: none;
}
#purchase-dialog {
  padding: 1rem;
  background-color: rgb(250, 250, 250);
  width: 35%;
  height: 30%;
  border-radius: 1rem;
  border: 1px solid #121212;
  display: flex;
  flex-direction: column;
}
.purchase-dialog-row {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  margin: 0.5rem 0rem;
}
.purchase-dialog-label {
  color: #121212;
  font-size: medium;
  width: 30%;
}

.purchase-dialog-input[type="text"] {
  height: 2rem;
  border: 1px solid #121212;
  width: 70%;
  border-radius: 0.3rem;
  box-sizing: border-box;
  outline: none;
  padding-left: 0.5rem;
  font-size: 0.9rem;
  color: #121212;
}

#cancel-purchase-btn {
  height: 2rem;
  border-radius: 0.4rem;
  width: 6.5rem;
  border: 1px solid #da1212;
  color: #da1212;
  font-size: 1.3rem;
  text-align: center;
  line-height: 1.9rem;
  user-select: none;
  margin-right: 1rem;
}
#cancel-purchase-btn:hover {
  background-color: #da1212;
  color: white;
  transition: background-color 0.3s ease;
}
#verify-purchase-btn {
  height: 2rem;
  border-radius: 0.4rem;
  width: 6.5rem;
  border: 1px solid #121212;
  color: #121212;
  font-size: 1.3rem;
  text-align: center;
  line-height: 1.9rem;
  user-select: none;
  cursor: pointer;
}
#verify-purchase-btn:hover {
  background-color: #121212;
  color: white;
  transition: background-color 0.3s ease;
}
.ticket-error-warning {
  height: 1rem;
  font-size: small;
  margin-bottom: 0.3rem;
  color: #da1212;
}
.hide-tickets-error {
  display: none;
}

.purchase-list-container {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(3px);
  z-index: 10;
}
.hide-purchase-list {
  display: none;
}
#purchase-list {
  background-color: rgb(250, 250, 250);
  width: 60%;
  height: 80%;
  border-radius: 1rem;
  border: 1px solid #121212;
  display: flex;
  flex-direction: column;
  padding: 1rem;
}
#purchase-list-header {
  display: flex;
  height: 1.7rem;
  justify-content: flex-start;
  align-items: center;
}
.purchase-list-nav-btn {
  height: 1.8rem;
  text-align: center;
  padding: 0rem 0.5rem;
  line-height: 1.7rem;
  border-radius: 0.8rem;
  font-size: 1rem;
  user-select: none;
  margin-right: 1rem;
  font-weight: bold;
  color: #121212;
  border: 1px solid #121212;
}
.purchase-list-nav-btn-selected {
  background-color: #121212;
  color: white;
  transition: background-color 0.3s ease;
}
#purchase-list-items {
  width: 100%;
  height: 95%;
  margin-top: 0.5rem;
  overflow-y: scroll;
}
#purchase-list-items::-webkit-scrollbar {
  display: none;
}

.purchase-card {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: white;
  width: 100%;
  height: 6rem;
  border: 1px solid #121212;
  border-radius: 0.4rem;
  margin-bottom: 1rem;
}
.purchase-card:hover {
  border: 2px solid #121212;
  background-color: whitesmoke;
}
.purchase-card-col-1 {
  display: flex;
  flex-direction: column;
  color: #121212;
  font-size: large;
  font-weight: bold;
  width: 20%;
  padding: 0rem 1rem;
}
.purchase-card-col-2 {
  display: flex;
  flex-direction: column;
  color: #121212;
  font-size: medium;
  font-weight: lighter;
  padding: 0rem 0.5rem;
}
.refund-btn {
  height: 2rem;
  border-radius: 0.4rem;
  width: 7rem;
  border: 1px solid #121212;
  color: #121212;
  font-size: 1.3rem;
  margin-left: auto;
  text-align: center;
  line-height: 1.9rem;
  user-select: none;
  margin-right: 1rem;
}
.refund-btn:hover {
  background-color: #121212;
  color: white;
  transition: background-color 0.3s ease;
}
#search-warning {
  font-size: 3rem;
  font-weight: bold;
  color: #121212;
  width: 100%;
  text-align: center;
  margin: 4rem 0rem;
}

#refund-confirm-container {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
}

#refund-confrim {
  width: 30%;
  height: 20%;
  border: 2px solid #121212;
  background-color: white;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #121212;
}

#refund-row {
  display: flex;
  flex-direction: row;
  font-size: large;
}

#cancel-refund-btn {
  height: 2rem;
  border-radius: 0.4rem;
  width: 6.5rem;
  border: 1px solid #da1212;
  color: #da1212;
  font-size: 1.3rem;
  text-align: center;
  line-height: 1.9rem;
  user-select: none;
  margin-right: 1rem;
}
#cancel-refund-btn:hover {
  background-color: #da1212;
  color: white;
  transition: background-color 0.3s ease;
}
#confirm-refund-btn {
  height: 2rem;
  border-radius: 0.4rem;
  width: 6.5rem;
  border: 1px solid #121212;
  color: #121212;
  font-size: 1.3rem;
  margin-left: auto;
  text-align: center;
  line-height: 1.9rem;
  user-select: none;
}
#confirm-refund-btn:hover {
  background-color: #121212;
  color: white;
  transition: background-color 0.3s ease;
}
</style>
