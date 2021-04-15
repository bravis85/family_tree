import React, { Component } from "react";
import harold from "./harold.png";
// import axios from "axios";
import "./IdCard.css";
import ParentsBox from "./ParentsBox";
import ChildrenBox from "./ChildrenBox";
import MarriedBox from "./MarriedBox";
import TargetBox from "./TargetBox";
import NewChild from "./NewChild";
import NewParent from "./NewParent";
import NewSpouse from "./NewSpouse";
import StateTemplate from "./StateTemplate";
import { authContext } from "./services/ProvideAuth";
import FamilyMemberImage from "./FamilyMemberImage";
import CommonHttp from "./services/CommonHttp";
import UploadImages from "./UploadImages";

class IdCard extends Component {
  static contextType = authContext;
  constructor() {
    super();

    this.state = new StateTemplate();

    // this.handleChange = this.handleChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
    this.updateTarget = this.updateTarget.bind(this);
    this.refreshData = this.refreshData.bind(this);
    this.showNewChild = this.showNewChild.bind(this);
    this.submitNewChild = this.submitNewChild.bind(this);
    this.showNewParent = this.showNewParent.bind(this);
    this.submitNewParent = this.submitNewParent.bind(this);
    this.showNewSpouse = this.showNewSpouse.bind(this);
    this.submitNewSpouse = this.submitNewSpouse.bind(this);
    this.submitPhoto = this.submitPhoto.bind(this);
  }

  componentDidMount() {
    this._http = new CommonHttp(this.context.jwt);
    this.setState(
      {
        dataState: {
          ...this.state.dataState,
          uuid_family_member: this.context.focus,
        },
      },
      () => {
        console.log(this.state);
      }
    );
  }

  async refreshData(prevState) {
    if (prevState) {
      if (
        this.state.dataState.uuid_family_member !==
        prevState.dataState.uuid_family_member
      ) {
        const request = { target: this.state.dataState.uuid_family_member };
        const data = await this._http.axios.post("/get_target_data", request);
        this.setState({ dataState: data.data }, () => {
          this.context.setFocus(this.state.dataState.uuid_family_member);
        });
      }
    } else {
      const request = { target: this.state.dataState.uuid_family_member };
      const data = await this._http.axios.post("/get_target_data", request);
      this.setState({ dataState: data.data }, () => {
        this.context.setFocus(this.state.dataState.uuid_family_member);
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    this.refreshData(prevState);
    console.log(this.state);
  }

  updateTarget(e) {
    e.preventDefault();

    if (e.target.getAttribute("uuid")) {
      //it's a double check but doesn't really seem necessary
      // if (
      //   e.target.getAttribute("uuid") !==
      //   this.state.dataState.uuid_family_member
      // ) {
      this.setState({
        dataState: {
          ...this.state.dataState,
          uuid_family_member: e.target.getAttribute("uuid"),
        },
      });
      // }
    } else {
      this.showNewParent(e.target.getAttribute("name"));
    }
  }

  showNewChild(parentGender) {
    console.log(parentGender);
    this.setState(
      {
        UIstate: {
          editNewChild: true,
        },
      },
      () => {
        console.log(this.state);
      }
    );
  }

  async submitNewChild(newChildDetails) {
    console.log(newChildDetails);
    await this._http.axios.post("/create_new_child", newChildDetails);
    this.setState(
      {
        UIstate: {
          editNewChild: false,
        },
      },
      () => {
        this.refreshData();
      }
    );
  }

  showNewParent(gender) {
    console.log(gender);
    this.setState({
      UIstate: {
        editNewParent: true,
        newParentGender: gender,
      },
    });
  }

  async submitNewParent(newParentDetails) {
    await this._http.axios.post("/create_new_parent", newParentDetails);

    this.setState(
      {
        UIstate: {
          editNewParent: false,
        },
      },
      () => {
        this.refreshData();
      }
    );
  }

  showNewSpouse() {
    this.setState({
      UIstate: { editNewSpouse: true },
    });
  }

  async submitNewSpouse(newSpouseDetails) {
    //total update
    await this._http.axios.post("/create_new_spouse", newSpouseDetails);

    this.setState(
      {
        UIstate: {
          editNewSpouse: false,
        },
      },
      () => {
        this.refreshData();
      }
    );
  }

  async submitPhoto(image) {
    await this._http.post("/upload", image);
    this.refreshData();
  }

  render() {
    let newChildComponent;
    if (this.state.UIstate.editNewChild) {
      newChildComponent = (
        <NewChild
          state={this.state.dataState}
          submitNewChild={this.submitNewChild}
        />
      );
    }

    let newParentComponent;
    if (this.state.UIstate.editNewParent) {
      newParentComponent = (
        <NewParent
          state={this.state.dataState}
          UIstate={this.state.UIstate}
          submitNewParent={this.submitNewParent}
        />
      );
    }

    let newSpouseComponent;
    if (this.state.UIstate.editNewSpouse) {
      newSpouseComponent = (
        <NewSpouse
          state={this.state.dataState}
          submitNewSpouse={this.submitNewSpouse}
        />
      );
    }

    return (
      <div className="IdCard">
        {newChildComponent}
        {newParentComponent}
        {newSpouseComponent}

        <div className="top_sect">
          <ParentsBox
            handleUpd={this.updateTarget}
            mother={this.state.dataState.mothe}
            father={this.state.dataState.fathe}
          />
        </div>
        <div className="mid_sect">
          <FamilyMemberImage
            src={null}
            state={this.state.dataState}
            submitPhoto={this.submitPhoto}
          />
          <TargetBox target={this.state.dataState} />
          <UploadImages target={this.state.dataState.uuid_family_member} />
          {/* <div className="uuid_form">
            <form onSubmit={this.handleSubmit}>
              <input
                type="text"
                name="uuid_box"
                value={this.state.uuid_family_member}
                onChange={this.handleChange}
              ></input>
              <input type="submit" value="Submit" />
            </form>
          </div> */}
        </div>
        <div className="btm_sect">
          <MarriedBox
            spouses={this.state.dataState.spouses}
            handleUpd={this.updateTarget}
            showNewSpouse={this.showNewSpouse}
          />
          <ChildrenBox
            children={this.state.dataState.children}
            updateTarget={this.updateTarget}
            showNewChild={this.showNewChild}
          />
        </div>
      </div>
    );
  }
}

export default IdCard;
