import JoditEditor from "../../../Jodit/Editor";
import { Dropdown } from "semantic-ui-react";
import { PUBLIC_STUDIES } from "../../../Queries/Study";
import { useQuery } from "@apollo/client";



export default function ResourceForm({ inputs, handleChange, handleSave }) {
    const data= useQuery(PUBLIC_STUDIES); 

    const publicStudies = data?.studies || [];
  

    const options = publicStudies.map((studies) => ({
        key: studies.id,
        text: studies.title,
        value: studies.id,
      }));

      const onChange = (event, data) => {
        handleChange({
          target: {
            name: "studies",
            value: data.value.map((id) => ({ id: id })),
          },
        });
      };

    //   const value = inputs?.classes?.map((cl) => cl?.id);


    const setContent = (content) =>
      handleChange({
        target: { name: "content", value: content },
      });
  
    return (
  
        <div className="modalWrapper">
        <label htmlFor="title">
          <p>Title</p>
          <input
            type="text"
            id="title"
            name="title"
            value={inputs?.title}
            onChange={handleChange}
            required
          />
        </label>
        <JoditEditor
          content={inputs?.content}
          setContent={(content) =>
            handleChange({ target: { name: "content", value: content } })
          }
        />

        <div></div>

<label htmlFor="studies" >
          <p>Studies</p>
          <div>
            <Dropdown
              placeholder="Type Linked Resources"
              fluid
              multiple
              search
              selection
              options={options}
            //   value={value}
              onChange={onChange}
            />
          </div>
        </label>

<div>

        <label htmlFor="links">
          <p>Linked Resources</p>
          <input
            type="text"
            id="description"
            name="description"
            // value={inputs}
            onChange={handleChange}
            required
          />
        </label>

</div>



        <button
          onClick={() => {
            handleSave();
            // setOpen(false);
          }}
        >
          Save
        </button>
      </div>
    );
  }
  

