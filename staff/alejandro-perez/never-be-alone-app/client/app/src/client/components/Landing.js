import React, { Component } from 'react';
import { connect } from "react-redux";
import {fetchUser} from '../redux/actions/user'

class Landing extends Component{


  render(){
    return <div>
    <div class="page-header header-filter" data-parallax="true" style={{"background-image": "url('../assets/img/landing_restaurant.jpg')"}}>
    <div class="container">
      <div class="row">
        <div class="col-md-6 ml-auto mr-auto">
          <h1 class="title">Your Story Starts With Us.</h1>
          <h4>Create and join groups to start making plans together</h4>
          <br/>
          <div className="d-flex justify-content-between">
          <button onClick={() => this.props.history.push("/register")} target="_blank" class="btn btn-danger btn-raised btn-lg">
            <i class="fas fa-user-plus"></i> Register Now!
          </button>
          <h3>Or</h3>
          <button onClick={() => this.props.history.push("/login")} target="_blank" class="btn btn-primary btn-raised btn-lg">
            <i class="fas fa-user-plus"></i> Login Now!
          </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="main main-raised">
    <div class="container">
      <div class="section text-center">
        <div class="row">
          <div class="col-md-8 ml-auto mr-auto">
            <h2 class="title">Lorem ipsum dolor sit amet consectetur.</h2>
            <h5 class="description">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vitae, libero molestias nostrum iste facilis vero cum! Consectetur sed alias earum nobis, animi hic error explicabo eligendi adipisci, asperiores enim laborum.Inventore qui aperiam harum fugiat maiores officiis facilis eius quasi corporis a molestiae iusto aspernatur, accusamus atque repudiandae, necessitatibus nam, blanditiis doloribus natus assumenda tempore. Itaque deserunt autem perferendis impedit!</h5>
          </div>
        </div>
        <div class="features">
          <div class="row">
            <div class="col-md-4">
              <div class="info">
                <div class="icon icon-info">
                  <i class="material-icons">chat</i>
                </div>
                <h4 class="info-title">Lorem, ipsum.</h4>
                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Praesentium architecto dolores eveniet ad similique. Officia esse natus numquam ullam cum tempore, quas odit ipsa accusantium libero. Et ea porro quam.
                Molestias unde distinctio, exercitationem quibusdam id dignissimos ab similique, nihil fugit consectetur maiores libero earum repellendus assumenda a amet. Fugit nulla illum tempore iste debitis in suscipit explicabo maxime aut.
                At aliquid, quam perspiciatis ipsum reprehenderit adipisci vero eligendi dolore ab quasi numquam vitae quisquam iure cum eaque accusantium pariatur alias praesentium illo hic porro aspernatur fuga. Temporibus, quaerat eligendi.</p>
              </div>
            </div>
            <div class="col-md-4">
              <div class="info">
                <div class="icon icon-success">
                  <i class="material-icons">verified_user</i>
                </div>
                <h4 class="info-title">Lorem, ipsum.</h4>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut suscipit earum culpa tempore deserunt, impedit in harum rem pariatur commodi necessitatibus officiis perferendis libero quos alias magni nisi maxime velit.
                Magni officiis minima, labore totam dolorem cum vitae at laborum eum delectus quas impedit deleniti reiciendis nihil ratione dolores illum, et nulla adipisci necessitatibus, facere inventore accusantium assumenda dolor! Blanditiis.
                Minus nobis repudiandae voluptates illum. Accusamus quos pariatur beatae magni aspernatur porro, ullam obcaecati sunt veniam cum nam rerum necessitatibus impedit repellendus ad voluptates molestias recusandae quidem! Reiciendis, natus esse?</p>
              </div>
            </div>
            <div class="col-md-4">
              <div class="info">
                <div class="icon icon-primary">
                  <i class="material-icons">mood</i>
                </div>
                <h4 class="info-title">Lorem, ipsum.</h4>
                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam, officiis tenetur ab, nihil temporibus optio corrupti maxime fugiat iure recusandae animi numquam aliquid cumque illo, natus officia placeat iste. Numquam.Quam possimus beatae incidunt voluptas a voluptatum provident molestias quos. Placeat quaerat cupiditate neque in nemo quidem ab commodi quo animi dolorem, tenetur saepe porro aspernatur explicabo, recusandae nulla perferendis?</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="section text-center">
        <h2 class="title">Create Events!</h2>
        <div class="team">
          <div class="row">
            <div class="col-md-4">
              <div class="team-player">
                <div class="card card-plain">
                  <div class="col-md-6 ml-auto mr-auto">
                    <img src="../assets/img/party.jpg" alt="Thumbnail Image" class="img-raised rounded-circle img-fluid"/>
                  </div>
                  <h4 class="card-title">Party
                    <br/>
                    <small class="card-description text-muted">Event</small>
                  </h4>
                  <div class="card-body">
                    <p class="card-description">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident asperiores ab natus, doloribus aut quam distinctio esse quidem nihil, rem minima voluptas molestiae nesciunt porro, cumque sapiente. Illum, tempora ab?Accusantium, consectetur labore commodi exercitationem reprehenderit aperiam quae nostrum assumenda praesentium tempore magnam? Perferendis reiciendis consequatur, hic voluptates iure quam facilis cupiditate? Earum voluptatum, ipsum sint numquam deleniti omnis? Nulla?
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="team-player">
                <div class="card card-plain">
                  <div class="col-md-6 ml-auto mr-auto">
                    <img src="../assets/img/tech.jpeg" alt="Thumbnail Image" class="img-raised rounded-circle img-fluid"/>
                  </div>
                  <h4 class="card-title">Technology
                    <br/>
                    <small class="card-description text-muted">Event</small>
                  </h4>
                  <div class="card-body">
                    <p class="card-description">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, sit! Minima amet quas dolorem velit, quos labore nesciunt atque architecto excepturi ducimus repellendus corrupti consectetur odio tempore ab, error et.Doloribus facilis eaque deleniti ducimus doloremque fuga voluptate quisquam fugit architecto est odit eveniet a enim, maxime cum numquam quasi, quo rerum nulla. Nobis magni perspiciatis ratione, reprehenderit atque aliquid!
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="team-player">
                <div class="card card-plain">
                  <div class="col-md-6 ml-auto mr-auto">
                    <img src="../assets/img/dinner.jpg" alt="Thumbnail Image" class="img-raised rounded-circle img-fluid"/>
                  </div>
                  <h4 class="card-title">Gastronomy
                    <br/>
                    <small class="card-description text-muted">Event</small>
                  </h4>
                  <div class="card-body">
                    <p class="card-description">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt delectus pariatur est aut quam id blanditiis assumenda quae, eaque, ex harum quidem numquam commodi autem? Nobis culpa sapiente aliquam consequatur.Animi id quam eius at neque laborum, quas reprehenderit accusamus quaerat ipsa aperiam, maiores atque nobis eos enim saepe! Distinctio molestiae illum minima voluptatum, accusamus nulla tempore cum aperiam dicta.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>


  }


}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(
    mapStateToProps,
    { fetchUser }
  )(Landing)