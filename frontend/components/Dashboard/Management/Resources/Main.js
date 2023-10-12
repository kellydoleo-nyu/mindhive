import { useQuery } from "@apollo/client";
import moment from "moment";
import Link from "next/link";
import Add from "./Add"; 

import { GET_ALL_RESOURCES } from "../../../Queries/Resource";

import { StyledTaskCard } from "../../../styles/StyledCard"; 

// import EditNetwork from "./Edit";
// import AddNetwork from "./Add";

export default function Resources({ query, user }) {
  const { data, loading, error } = useQuery(GET_ALL_RESOURCES);
  const resources = data?.resources || [];

  console.log(resources, "resources");

  const { id, action } = query;
  if (action) {
    if (action === "add") {
      return <Add user={user} />;
    }
  }
 
//     if (action === "edit" && id) {
//       return <EditNetwork user={user} id={id} />;
//     }
//   }

// let cards; 
// if(data != undefined) {
//   cards = <StyledTaskCard>
//   <div className="cardInfo">
//       <div className="title">
//         <div>{data?.title}</div>
//       </div>
//     </div>
//   </StyledTaskCard>
// }


  


  return (
    <div>
      <div className="navigationHeader">
        <Link
          href={{
            pathname: "/dashboard/management/resources",
            query: {
              action: "add",
            },
          }}
        >
          <button>Add Resource</button>
        </Link>
      </div>
      {/* <div>{resources[0]}</div> */}
   {
    resources.map((resource) => {
      return(

<StyledTaskCard >
        <div className="cardInfo">
          <div className="title">
            <div>{resource.title}</div>
          </div>
        </div>
       </StyledTaskCard>



      )
    })
   }


    </div>
  );
}
