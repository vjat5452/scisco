import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Link,
    Chip,
} from "@mui/material";

const Submissions = ({ submissions }) => {
    return (
        <div>
            <TableContainer component={Paper} elevation={2}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell
                                sx={{ fontWeight: "bold", fontSize: "13px" }}
                            >
                                Problem Name
                            </TableCell>
                            <TableCell
                                sx={{ fontWeight: "bold", fontSize: "13px" }}
                                align="right"
                            >
                                Verdict
                            </TableCell>
                            {/* <TableCell
                                sx={{ fontWeight: "bold", fontSize: "13px" }}
                                align="right"
                            >
                                Tags
                            </TableCell> */}
                            <TableCell
                                sx={{ fontWeight: "bold", fontSize: "13px" }}
                                align="right"
                            >
                                Submission URL
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {submissions &&
                            submissions.slice(0, 10).map((submission) => (
                                <TableRow
                                    key={submission.submissionTime}
                                    sx={{
                                        "&:last-child td, &:last-child th": {
                                            border: 0,
                                        },
                                    }}
                                >
                                    <TableCell
                                        sx={{ fontSize: "13px" }}
                                        component="th"
                                        scope="row"
                                    >
                                        <Link
                                            href={submission.problemLink}
                                            underline="hover"
                                        >
                                            {submission.problemName}
                                        </Link>
                                    </TableCell>
                                    <TableCell
                                        sx={{ fontSize: "13px" }}
                                        align="right"
                                    >
                                        {submission.verdict}
                                    </TableCell>
                                    {/* <TableCell
                                        sx={{
                                            fontSize: "13px",
                                            display: "flex",
                                            flexWrap: "wrap",
                                            justifyContent: "flex-start",
                                        }}
                                        align="right"
                                    >
                                        {submission.problemTags.map((tag) => {
                                            return (
                                                <Chip
                                                    key={tag}
                                                    size="small"
                                                    label={tag}
                                                    sx={{ margin: "5px" }}
                                                />
                                            );
                                        })}
                                    </TableCell> */}
                                    <TableCell
                                        sx={{ fontSize: "13px" }}
                                        align="right"
                                    >
                                        <Link href={submission.submissionUrl}>
                                            Click
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default Submissions;
