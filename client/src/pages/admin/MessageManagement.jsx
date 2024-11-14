import { useFetchData } from "6pp";
import { Avatar, Box, Skeleton, Stack } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import RenderAttachment from "../../components/shared/RenderAttachment";
import Table from "../../components/shared/Table";
import { server } from "../../constants/config";
import { useErrors } from "../../hooks/hook";
import { fileFormat, transformImage } from "../../lib/features";
const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "attachments",
    headerName: "Attachments",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => {
      const { attachments } = params.row;
      return attachments?.length > 0
        ? attachments?.map((i) => {
            const url = i.url;
            const file = fileFormat(url);
            return (
              <Box>
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  download
                  style={{
                    color: "black",
                  }}
                >
                  {RenderAttachment(file, url)}
                </a>
              </Box>
            );
          })
        : "No Attachments!";
    },
  },
  {
    field: "content",
    headerName: "Content",
    headerClassName: "table-header",
    width: 400,
  },
  {
    field: "sender",
    headerName: "Sent By",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => (
      <Stack
        direction={"row"}
        spacing={"1rem"}
        alignItems={"center"}
      >
        <Avatar
          alt={params.row.sender.name}
          src={params.row.sender.avatar}
        />
        <span>{params.row.sender.name}</span>
      </Stack>
    ),
  },
  {
    field: "chat",
    headerName: "Chat",
    headerClassName: "table-header",
    width: 220,
  },
  {
    field: "groupChat",
    headerName: "Group Chat",
    headerClassName: "table-header",
    width: 100,
  },
  {
    field: "createdAt",
    headerName: "Time",
    headerClassName: "table-header",
    width: 250,
  },
];

const MessageManagement = () => {
  const { loading, data, error } = useFetchData(`${server}/admin/messages`, "dashboard-messages");
  const { result } = data || {};

  useErrors([
    {
      isError: error,
      error: error,
    },
  ]);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (result) {
      setRows(
        result?.map((i) => ({
          ...i,
          id: i._id,
          sender: {
            avatar: transformImage(i.sender.avatar, 50),
            name: i.sender.name,
          },
          createdAt: moment(i.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
        }))
      );
    }
  }, [result]);

  return (
    <>
      <AdminLayout>
        {loading ? (
          <Skeleton height={"100vh"} />
        ) : (
          <Table
            heading={"All Messages"}
            columns={columns}
            rows={rows}
            rowHeight={200}
          />
        )}
      </AdminLayout>
    </>
  );
};

export default MessageManagement;
