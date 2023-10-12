import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { Modal } from "semantic-ui-react";
import JoditEditor from "../../../Jodit/Editor";
import useTranslation from "next-translate/useTranslation";

import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 7);

import useForm from "../../../../lib/useForm";
import ResourceForm from "./ResourceForm";
// import DisplayError from "../../ErrorMessage";

// import TagForm from "../../Tags/TagForm";
// 
// import HomeworkModal from "../../Assignment/Modal";

import { CREATE_RESOURCE } from "../../../Mutations/Resource";
import { GET_RESOURCE } from "../../../Queries/Resource";

export default function AddResource({ user, children }) {

  // const { inputs, handleChange, clearForm } = useForm({
  //   title: "",
  //   description: "",
  //   content: "",
  // });


  // const [createResource, { data, loading, error }] = useMutation(CREATE_RESOURCE, {
  //   variables: inputs,
  //   refetchQueries: [{ query: GET_RESOURCE, variables: { id: user?.id } }],
  // });

  // const [createResource, { data, loading, error }] = useMutation(CREATE_RESOURCE, {
  //   variables: inputs,
  //   refetchQueries: [{ query: GET_RESOURCE, variables: { id: user?.id } }],
  // });

  // async function handleSave(e) {
  //   e.preventDefault();
  //   await createResource({
  //     variables: {
  //       code: nanoid(),
  //     },
  //   });
  //   router.push({
  //     pathname: "/dashboard/resources",
  //   });
  // }

  // const [
  //   createResource,
  //   { data: createData, loading: createLoading, error: createError },
  // ] = useMutation(CREATE_RESOURCE, {
  //   variables: inputs,
  //   refetchQueries: [[
  //     {
  //       query: GET_RESOURCE,
  //       variables: { userId: user?.id },
  //     },
  //   ],],
  // });

  // async function handleSave(e) {
  //   e.preventDefault();
  //   await createResource({
  //     variables: {
  //       ...inputs,
  //     },
  //   });
  //   router.push({
  //     pathname: `/dashboard/management/resources`,
  //   });
  // }

  const router = useRouter();

  const { inputs, handleChange, clearForm } = useForm({
    title: "",
    content: "",
  });

  console.log(inputs, "inputs add");

  const [createResource, { loading }] = useMutation(CREATE_RESOURCE, {
    variables: {
      ...inputs,
      code: nanoid(),
    },
    refetchQueries: [
      {
        query: GET_RESOURCE,
        variables: { userId: user?.id },
      },
    ],
  });

  const handleSave = () => {
    createResource();
    router.push({
      pathname: "/dashboard/resources",
    });
    clearForm();
  };

  // return (
  //   <div>
  //     <TagForm inputs={inputs} handleChange={handleChange} />
  //     <button onClick={handleSave}>Save</button>
  //   </div>
  // );

  return (
   
   <ResourceForm handleChange={handleChange} handleSave={handleSave} />
    // <HomeworkModal
    //   btnName="Save"
    //   inputs={inputs}
    //   handleChange={handleChange}
    //   submit={handleSave}
    // >
    //   {children}
    // </HomeworkModal>
  );
}
