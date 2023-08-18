import {
  TextField,
  Button,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

export function Home() {
  return (
    <main>
      <Typography variant="h1">Welcome to the InRoad dApp</Typography>
      <Typography variant="h3">
        Please login to your near wallet if you want to interact with the smart
        contracts
      </Typography>
      <Typography>
        You can still read info from the smart contracts even if you are not
        logged in however to write or change the state of the smart contract you
        must be logged in.
      </Typography>
      <Typography>
        Do not worry, this app runs in the test network ("testnet"). It works
        just like the main network ("mainnet"), but using NEAR Tokens that are
        only for testing!
      </Typography>
    </main>
  );
}

export function FormComponent({ isSignedIn, contractId, wallet }) {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!id || !name) {
      return; // Prevent submitting with empty ID
    }

    setIsSubmitting(true);

    try {
      const args = {
        project_id: id,
        project_name: name,
        description: description,
      };
      await wallet.callMethod({
        method: "create_factory_subaccount_and_deploy",
        args,
        contractId,
        deposit: "5000000000000000000000000",
      });
      console.log("Method called successfully");
    } catch (error) {
      console.error("Error calling method:", error);
    } finally {
      setIsSubmitting(false);
    }

    setName("");
    setId("");
    setDescription("");
  };

  if (!isSignedIn) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <Typography variant="h5" align="center">
          Please sign in to access the form.
        </Typography>
      </Box>
    );
  }

  if (contractId !== wallet.accountId) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <Typography variant="h5" align="center">
          You do not have permission to access this form.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={6}>
        <form onSubmit={handleSubmit}>
          {/* Render your form elements */}
          <TextField
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="ID"
            variant="outlined"
            value={id}
            onChange={(e) => setId(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={4}
            fullWidth
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting || !id || !name}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Grid>
    </Grid>
  );
}

export function ProjectList({ wallet, contractId }) {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const result = await wallet.viewMethod({
          contractId,
          method: "view_contracts",
        });
        setProjects(result);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    }

    fetchProjects();
  }, [wallet, contractId]);

  return (
    <Box mt={3}>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Project List
      </Typography>
      <Grid container spacing={2}>
        {" "}
        {/* Adjust spacing between cards */}
        {projects.map((project, index) => (
          <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ minWidth: 275 }}>
              <CardContent
                component={Link}
                to={`/view-projects/${project[1].split(".")[0]}`}
                sx={{
                  textDecoration: "none",
                  color: "inherit",
                  "&:hover": {
                    textDecoration: "none",
                  },
                  padding: "10px",
                  display: "flex", // Add display flex
                  flexDirection: "column", // Stack content vertically
                  alignItems: "center", // Center content horizontally
                }}
              >
                <Typography variant="h6" component="div">
                  {project[0]} {/* Assuming project_name is at index 0 */}
                </Typography>
                <br />
                <Typography variant="body2" color="text.secondary">
                  Project ID: {project[1]}{" "}
                  {/* Assuming project_id is at index 1 */}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export function ProjectDetails({ contractId, wallet }) {
  const { project } = useParams();
  const newContractId = `${project}.${contractId}`;
  // State for viewing comments
  const [comments, setComments] = useState([]);
  const [viewOpen, setViewOpen] = useState(false);

  // State for placing comments
  const [placeOpen, setPlaceOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [thumbsUp, setThumbsUp] = useState(true); // default to thumbs up

  const fetchComments = async () => {
    const result = await wallet.viewMethod({
      contractId: newContractId,
      method: "view_comments",
    });
    console.log(result);

    if (result && result.length > 0) {
      setComments(result);
    }
    setViewOpen(true);
  };

  const handleSubmitComment = async () => {
    const args = {
      message: commentText,
      thumbs_up: thumbsUp,
    };

    await wallet.callMethod({
      method: "place_comments",
      args: args,
      contractId: newContractId,
    });

    // Clear the textbox and close the dialog after submitting
    setCommentText("");
    setPlaceOpen(false);
  };

  return (
    <div>
      {/* Button to view comments */}
      <Button variant="contained" color="primary" onClick={fetchComments}>
        View Comments
      </Button>

      {/* Dialog to display comments */}
      <Dialog open={viewOpen} onClose={() => setViewOpen(false)}>
        <DialogTitle>Comments</DialogTitle>
        <DialogContent>
          <List>
            {comments.map((comment, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={comment.message}
                  secondary={`By ${comment.commenter} - ${
                    comment.thumbs_up ? "👍" : "👎"
                  }`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>

      {/* Button to place a new comment */}
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setPlaceOpen(true)}
      >
        Place Comment
      </Button>

      {/* Dialog to place a comment */}
      <Dialog open={placeOpen} onClose={() => setPlaceOpen(false)}>
        <DialogTitle>Place a Comment</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Enter your comment here"
          />
          <div>
            <IconButton
              onClick={() => setThumbsUp(true)}
              color={thumbsUp ? "primary" : "default"}
            >
              <ThumbUpIcon />
            </IconButton>
            <IconButton
              onClick={() => setThumbsUp(false)}
              color={!thumbsUp ? "primary" : "default"}
            >
              <ThumbDownIcon />
            </IconButton>
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitComment}
          >
            Submit
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
