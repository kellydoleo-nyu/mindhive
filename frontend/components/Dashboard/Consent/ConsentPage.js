import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";

import ReactHtmlParser from "react-html-parser";

import { GET_CONSENT } from "../../Queries/Consent";
import { EDIT_CONSENT } from "../../Mutations/Consent";
import useForm from "../../../lib/useForm";
import ConsentForm from "./ConsentForm";

export default function ConsentPage({ code, user, query }) {
  const router = useRouter();
  const { action } = query;

  const { data, loading, error } = useQuery(GET_CONSENT, {
    variables: { code },
  });

  const consent = data?.consent || { title: "", description: "", info: [] };

  const { inputs, handleChange, clearForm } = useForm({ ...consent });

  const [editConsent, { loading: editConsentLoading }] = useMutation(
    EDIT_CONSENT,
    {
      refetchQueries: [{ query: GET_CONSENT, variables: { code } }],
    }
  );

  async function handleSubmit(e) {
    e.preventDefault();
    await editConsent({
      variables: {
        ...inputs,
        collaborators: inputs?.collaborators?.map((col) => ({ id: col?.id })),
      },
    });
    router.push({
      pathname: "/dashboard/irb",
    });
  }

  if (action && action === "edit") {
    return (
      <ConsentForm
        inputs={inputs}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        headerName="Edit protocol"
        submitBtnName="Save"
        loading={loading}
        error={error}
      />
    );
  }

  return (
    <div>
      {consent?.author?.id === user?.id && (
        <Link
          href={{
            pathname: `/dashboard/irb/${code}`,
            query: { action: "edit" },
          }}
        >
          <button>Edit</button>
        </Link>
      )}

      <div>{consent?.title}</div>
      <div>{consent?.description}</div>

      {consent?.info?.map((block, i) => (
        <div key={i}>
          <h3>{block?.description}</h3>
          {ReactHtmlParser(block?.content)}
        </div>
      ))}
    </div>
  );
}
