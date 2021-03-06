import EditDelete from "./EditDelete";
import { useAuth } from "./services/ProvideAuth";
import _fn from "./fullName";

//parent could have other children
//so it's not enough to check that they just don't have any parents

const ParentsBox = (props) => {
  const thisContext = useAuth();
  return (
    <div className="idcard-component transparent-card shadow-sm">
      <h5>
        parents:
        <span
          style={{
            float: "right",
            marginRight: "5px",
          }}
        >
          {!thisContext.showPublic.publicMode && (
            <button
              className="settings-button"
              onClick={() => {
                props.showSettings(true);
              }}
              disabled={thisContext.blockUI}
            >
              <i className="fa fa-wrench" aria-hidden="true"></i>
            </button>
          )}
        </span>
      </h5>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        <button
          id="nav-btn"
          disabled={
            (thisContext.showPublic.publicMode && !props.father) ||
            thisContext.blockUI
          }
          name="Male"
          className="idcard-button transparent-card transparent-bg shadow-sm"
          uuid={
            (props.father || {}).uuid_family_member &&
            props.father.uuid_family_member
          }
          onClick={props.handleUpd}
          style={{
            flexBasis: "200px",
            flexGrow: "1",
          }}
        >
          {props.father
            ? _fn(props.father)
            : !thisContext.showPublic.publicMode
            ? "Add father"
            : "..."}

          {!thisContext.showPublic.publicMode && (
            <EditDelete
              source="father"
              uuid={
                (props.father || {}).uuid_family_member &&
                props.father.uuid_family_member
              }
              disableEdit={props.dataState.fathe ? false : true}
              permitDelete={
                (props.dataState.fathe
                  ? !(
                      props.dataState.fathe.fathe || props.dataState.fathe.mothe
                    )
                  : false) &&
                (props.dataState.siblingsViaFather
                  ? props.dataState.siblingsViaFather.length <= 1
                  : false)
                  ? true
                  : false
              }
            />
          )}
        </button>
        <button
          id="nav-btn"
          disabled={
            (thisContext.showPublic.publicMode && !props.mother) ||
            thisContext.blockUI
          }
          name="Female"
          className="idcard-button transparent-card transparent-bg shadow-sm"
          uuid={
            (props.mother || {}).uuid_family_member &&
            props.mother.uuid_family_member
          }
          onClick={props.handleUpd}
          style={{
            flexBasis: "200px",
            flexGrow: "1",
          }}
        >
          {props.mother
            ? _fn(props.mother)
            : !thisContext.showPublic.publicMode
            ? "Add mother"
            : "..."}
          {}

          {!thisContext.showPublic.publicMode && (
            <EditDelete
              source="mother"
              uuid={
                (props.mother || {}).uuid_family_member &&
                props.mother.uuid_family_member
              }
              disableEdit={props.dataState.mothe ? false : true}
              permitDelete={
                (props.dataState.mothe
                  ? !(
                      props.dataState.mothe.fathe || props.dataState.mothe.mothe
                    )
                  : false) &&
                (props.dataState.siblingsViaMother
                  ? props.dataState.siblingsViaMother.length <= 1
                  : false)
                  ? true
                  : false
              }
            />
          )}
        </button>
      </div>
    </div>
  );
};

export default ParentsBox;
