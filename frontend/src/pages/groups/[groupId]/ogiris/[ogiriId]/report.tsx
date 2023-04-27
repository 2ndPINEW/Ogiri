import { ResponseData, retrieveReportData } from "@/module/report";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

export const getServerSideProps: GetServerSideProps<{
  data: ResponseData;
}> = async (context) => {
  const { groupId, ogiriId } = context.params as any;
  const res = await retrieveReportData(groupId, ogiriId);

  return {
    props: {
      data: res,
    },
  };
};

function Page({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const answers = data.answers.map((answer) => {
    return (
      <div key={answer.id}>
        <h3>{answer.answer}</h3>
        <div>{answer.evaluation}</div>
        <div>{answer.score}</div>
      </div>
    );
  });

  return (
    <div>
      <h1>{data.odai}</h1>
      {answers}
    </div>
  );
}

export default Page;
