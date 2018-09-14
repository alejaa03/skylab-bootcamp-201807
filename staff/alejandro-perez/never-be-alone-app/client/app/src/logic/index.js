import axios from "axios";
// const API_URL = "http://localhost:5000/api";
const API_URL = "https://neverbealone-api.herokuapp.com/api"

const logic = {

  /**
   * Setter/getter for user token
   * @param {string} token
   * @return {string|undefined} - if token it sets it and returns undefined, else returns the token
   * 
   */

  token(token) {
    if (token) {
      this._token = token;
      return;
    }

    return this._token;
  },

  /**
   * Setter/getter for user token
   * @param {string} userId
   * @return {string|undefined|null} 
   * 
   */

  userId(userId) {
    if (userId) {
      this._userId = userId;

      return;
    }

    if(userId === null) this._userId = null

    return this._userId;
  },

  /**
   * CHECK IF USER IS LOGGED
   *
   * @returns {boolean}
   */
  isLogged() {
    const userId = this.userId();
    const token = this.token();
    return typeof userId === "string" && typeof token === "string";
  },

      /**
     * Logs out a user
     * Clears the session storage
     *
     * @returns {Promise}
     */
    logout() {
      return Promise.resolve().then(() => {
          this.userId(null);
          this.token(null);
      });
    },

  /**
   * Setter/getter for user token
   * @param {string} email
   * @param {string} password
   * 
   * @return {promise} - With the userid and its token
   */

  login(email, password) {
    return axios
      .post(`${API_URL}/authenticate`, { email, password })
      .then(data => {
        const {
          data: { id, token },
          status,
          statusText
        } = data;
        if (statusText !== "OK" || status !== 200)
          throw Error(`unexpected response status ${statusText} (${status})`);
        this.token(token);
        this.userId(id);
        return { id, token };
      });
  },

  /**
   * gets current user info
   * @return {promise} - contains user info
   * 
   */

  getUser() {
    return axios
      .get(`${API_URL}/users/${this.userId()}`)
      .then(user => user.data)
  },

  /**
   * gets a user info
   * 
   * @param {string} id - id of the user to retrieve
   * @return {promise} - contains user info
   * 
   */

  getUserById(id) {
    return axios
      .get(`${API_URL}/users/${id}`)
      .then(user => user.data)
  },

  /**
   * gets group by id
   * 
   * @param {string} id - id of the group to retrieve
   * @return {promise} - contains group info
   * 
   */

  getGroupById(id) {
    return axios
      .get(`${API_URL}/groups/${id}`)
      .then(group => group.data)
  },

  /**
   * get events by date
   * 
   * @param {string} groupId - groupid to look for events
   * @param {string} date - date to look for events
   * @param {string} userId - id of the user to look for his events
   * 
   * @return {promise} - contains event info
   * 
   */

  getEventByDate(groupId, date, userId) {
    if (groupId) {
      return axios
        .get(`${API_URL}/groups/${groupId}/events/${date}`)
        .then(event => event.data)
    } else {
      return axios
        .get(`${API_URL}/users/${userId}/events/${date}`)
        .then(event => event.data)
    }
  },

  /**
   * join a group
   * 
   * @param {string} groupId - id of the group to join
   * @return {promise} - contains group info
   * 
   */

  joinGroup(groupId) {
    return axios
      .put(`${API_URL}/groups/${groupId}/users/${this.userId()}`, undefined, {
        headers: { authorization: `Bearer ${this.token()}` }
      })
      .then(group => {
        return group.data
      })
  },

  /**
   * leave a group
   * 
   * @param {string} groupId - id of the group to leave
   * @return {promise} - contains group info
   * 
   */

  leaveGroup(groupId) {
    return axios
      .patch(`${API_URL}/users/${this.userId()}/groups/${groupId}`, undefined, {
        headers: { authorization: `Bearer ${this.token()}` }
      })
      .then(group => {
        return group.data
      })
  },

  /**
   * gets a user info
   * 
   * @param {string} group - id of the group to retrieve
   * @param {string} name - name of the event
   * @param {string} description - description of the event
   * @param {string} date - date of the event
   * @param {string} category - category of the event
   * @param {string} duration - duration of the event
   * @param {string} address - address of the event
   * 
   * @return {promise} - contains group info
   * 
   */

  createEvent(groupId,name, description, date, category, duration, address) {
    return Promise.resolve()
      .then(() => {
        if(!address.name) throw new Error('select a valid place!')
        if(!name) throw new Error('name is required')
        if(!description) throw new Error('description is required')
        if(!date) throw new Error('date is required')
        if(!category) throw new Error('category is required')
        if(!duration) throw new Error('duration is required')
        return axios
          .post(`${API_URL}/groups/${groupId}/users/${this.userId()}/events`, {name,description,date,category,duration,address}, {
            headers: { authorization: `Bearer ${this.token()}` }
          })
          .then(group => {
            return group.data
          })
      })
  },

  /**
   * accept a user into a group
   * 
   * @param {string} targetId - id of the user to accept
   * @param {string} groupId - id of the group to join
   * @return {promise} - contains group info
   * 
   */

  acceptUser(targetId, groupId) {
    return axios
      .put(`${API_URL}/groups/${groupId}/owners/${this.userId()}/request/${targetId}`, {}, {
        headers: { authorization: `Bearer ${this.token()}` }
      })
      .then(group => {
        return group.data
      })
  },

  /**
   * reject a user into a group
   * 
   * @param {string} targetId - id of the user to reject
   * @param {string} groupId - id of the group to apply
   * @return {promise} - contains group info
   * 
   */

  rejectUser(targetId, groupId) {
    return axios
      .patch(`${API_URL}/groups/${groupId}/owners/${this.userId()}/request/${targetId}`, {}, {
        headers: { authorization: `Bearer ${this.token()}` }
      })
      .then(group => {
        return group.data
      })
  },

  /**
   * kick a user of a group
   * 
   * @param {string} targetId - id of the user to kick
   * @param {string} groupId - id of the group to apply
   * @return {promise} - contains group info
   * 
   */

  kickUser(targetId, groupId) {
    return axios
      .delete(`${API_URL}/groups/${groupId}/owners/${this.userId()}/users/${targetId}`, {
        headers: { authorization: `Bearer ${this.token()}` }
      })
      .then(group => {
        return group.data
      })
  },

  /**
   * updates a user role in a group
   * 
   * @param {string} targetId - id of the user to update role
   * @param {string} groupId - id of the group to apply
   * @return {promise} - contains group info
   * 
   */

  updateRole(targetId, groupId) { 
    return axios
      .patch(`${API_URL}/groups/${groupId}/owners/${this.userId()}/users/${targetId}`,undefined, {
        headers: { authorization: `Bearer ${this.token()}` }
      })
      .then(group => {
        return group.data
      })
  },

  /**
   * delete a group
   * 
   * @param {string} groupId - id of the group to delete
   * @return {promise} - contains user info
   * 
   */

  deleteGroup(groupId) { 
    return axios
      .delete(`${API_URL}/users/${this.userId()}/groups/${groupId}`, {
        headers: { authorization: `Bearer ${this.token()}` }
      })
      .then(res => res)
  },

  /**
   * register a user, checks if user has upload photo, uploads to cloudinary and finally registers the user
   * 
   * @param {object} registerData - object containing user register information
   * @return {promise} - contains whether success or not
   * 
   */

  registerUser(registerData) {    
    if(registerData.photoProfile) return axios.patch(`${API_URL}/uploadPhoto`,{base64Image:registerData.photoProfile})
      .then(({data}) => {
        return axios
        .post(`${API_URL}/users/`,{...registerData,...{photoProfile:data.photo}})
          .then(res => res)
      })
    else {
      return axios
        .post(`${API_URL}/users/`,{...registerData})
          .then(res => res)
    }    
  },

  /**
   * attend an event
   * 
   * @param {string} eventId - id of the event to attend
   * @return {promise} - contains group info
   * 
  */

  attendEvent(eventId) {    
    return axios.put(`${API_URL}/users/${this.userId()}/events/${eventId}`,undefined, {
      headers: { authorization: `Bearer ${this.token()}` }
    })
      .then(res => res )
  },

  /**
   * fetch an event by id
   * 
   * @param {string} eventId - id of the event to attend
   * @return {promise} - contains event info
   * 
  */

  fetchEventById(eventId){
    return axios.get(`${API_URL}/events/${eventId}`)
    .then(res => res)
  },

  /**
   * fetch an event by id
   * 
   * @param {string} name - name of the group to create
   * @param {string} description - description of the group to create
   * @return {promise} - contains event info
   * 
  */

  createGroup(name,description){
    return axios.post(`${API_URL}/groups/${this.userId()}`, {name,description}, {
      headers: { authorization: `Bearer ${this.token()}` }
    })
    .then(res => res)
  }


};

export default logic;
