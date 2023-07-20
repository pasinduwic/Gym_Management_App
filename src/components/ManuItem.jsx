import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import TreeItem, { treeItemClasses } from "@mui/lab/TreeItem";
import { useSelector } from "react-redux";
import { addSidebarOpen } from "../redux/features/StatusVar";
import { useDispatch } from "react-redux";

const ManuItem = ({ labelIcon, labelText, nodeId, toLink, sub, ...other }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const screenSize = useSelector((state) => state.statusVar.value.screenSize);

  const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
    color: theme.palette.text.secondary,

    [`& .${treeItemClasses.content}`]: {
      color: theme.palette.text.secondary,
      display: screenSize > 852 ? "flex" : "block",
      borderTopRightRadius: theme.spacing(2),
      borderBottomRightRadius: theme.spacing(2),
      paddingRight: theme.spacing(1),
      fontWeight: theme.typography.fontWeightMedium,
      "&.Mui-expanded": {
        fontWeight: theme.typography.fontWeightRegular
      },
      "&:hover": {
        backgroundColor: theme.palette.action.hover
      },
      "&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused": {
        backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
        color: "var(--tree-view-color)"
      },
      [`& .${treeItemClasses.label}`]: {
        fontWeight: "inherit",
        color: "inherit"
      }
    },
    [`& .${treeItemClasses.group}`]: {
      marginLeft: 0,
      [`& .${treeItemClasses.content}`]: {
        paddingLeft: theme.spacing(2)
      }
    }
  }));

  return (
    <div className="manu-item">
      <StyledTreeItemRoot
        sx={{ display: screenSize > 852 ? "" : "block" }}
        label={
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: sub ? "16%" : "8%",
              p: 1,
              pr: 0,
              pl: sub ? 0 : 1,
              borderLeft: sub ? "1px solid #adb5bd" : "",
              ml: sub ? 1.4 : 0
            }}
          >
            <Box
              component={labelIcon}
              color="inherit"
              sx={{ mr: 1, fontSize: screenSize > 852 ? sub : "medium" }}
            />
            {screenSize > 852 ? (
              <Typography
                variant="body2"
                sx={{ fontWeight: "inherit", flexGrow: 1, textAlign: "left" }}
              >
                {labelText}
              </Typography>
            ) : (
              <></>
            )}
          </Box>
        }
        nodeId={nodeId}
        {...other}
        onClick={() => {
          if (screenSize < 852) dispatch(addSidebarOpen(false));
          navigate(toLink);
        }}
      />
    </div>
  );
};

export default ManuItem;
