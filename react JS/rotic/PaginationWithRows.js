import React from "react";
import "../page/platformadmin/PlatformAdmin.css";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const PaginationWithRows = (props) => {
  return (
    <>
      <div className="PaginationAlignForMobile">
        <Stack spacing={2}>
          <Pagination
            id="orgManagementPaginationID"
            count={props.count}
            onChange={props.onChange}
            page={props.page}
            shape="rounded"
            color="primary"
            showFirstButton
            showLastButton
          />
        </Stack>
      </div>
    </>
  );
};

export default PaginationWithRows;
