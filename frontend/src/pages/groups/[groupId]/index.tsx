import {
  Group,
  Ogiri,
  retrieveGroupData,
  retrieveOgirisData,
} from "@/module/group";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

export const getServerSideProps: GetServerSideProps<{
  group: Group;
  ogiris: Ogiri[];
}> = async (context) => {
  const { groupId } = context.params as any;
  const [group, ogiris] = await Promise.all([
    retrieveGroupData(groupId),
    retrieveOgirisData(groupId),
  ]);

  return {
    props: {
      group: group,
      ogiris: ogiris,
    },
  };
};

function Page({
  group,
  ogiris,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const ogiriElements = ogiris.map((ogiri: Ogiri) => {
    return (
      <div key={ogiri.id}>
        <h3>{ogiri.odai}</h3>
      </div>
    );
  });

  return (
    <div>
      <h1>{group.name}</h1>
      {ogiriElements}
    </div>
  );
}

export default Page;
