<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>
        Admission Interview Result
    </title>
</head>

<body
    style="
        margin: 0;
        padding: 0;
        background-color: #f4f4f5;
        font-family: Arial, Helvetica, sans-serif;
        color: #1f2937;
    "
>

    <table
        role="presentation"
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        style="
            width: 100%;
            background-color: #f4f4f5;
            padding: 30px 15px;
        "
    >
        <tr>
            <td align="center">

                <table
                    role="presentation"
                    width="100%"
                    cellspacing="0"
                    cellpadding="0"
                    border="0"
                    style="
                        max-width: 640px;
                        background-color: #ffffff;
                        border-radius: 14px;
                        overflow: hidden;
                        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
                    "
                >

                    <!-- HEADER -->

                    <tr>
                        <td
                            style="
                                background-color: #691f1f;
                                padding: 28px 30px;
                                text-align: center;
                            "
                        >

                            <h1
                                style="
                                    margin: 0;
                                    color: #ffffff;
                                    font-size: 22px;
                                    line-height: 1.4;
                                "
                            >
                                University of Southeastern Philippines
                            </h1>

                            <p
                                style="
                                    margin: 6px 0 0;
                                    color: #f5dede;
                                    font-size: 15px;
                                "
                            >
                                School of Law Admission Portal
                            </p>

                        </td>
                    </tr>


                    <!-- BODY -->

                    <tr>
                        <td
                            style="
                                padding: 34px 32px;
                            "
                        >

                            <p
                                style="
                                    margin: 0 0 20px;
                                    font-size: 16px;
                                    line-height: 1.7;
                                "
                            >
                                Dear
                                <strong>
                                    {{ $interviewee->full_name }}
                                </strong>,
                            </p>


                            <p
                                style="
                                    margin: 0 0 18px;
                                    font-size: 15px;
                                    line-height: 1.8;
                                "
                            >
                                Thank you for participating in the admission
                                interview for the University of Southeastern
                                Philippines School of Law.
                            </p>


                            <p
                                style="
                                    margin: 0 0 18px;
                                    font-size: 15px;
                                    line-height: 1.8;
                                "
                            >
                                After the evaluation of your interview, we regret
                                to inform you that you were not successful in the
                                admission interview.
                            </p>


                            <!-- APPLICANT INFORMATION -->

                            <table
                                role="presentation"
                                width="100%"
                                cellspacing="0"
                                cellpadding="0"
                                border="0"
                                style="
                                    width: 100%;
                                    margin: 26px 0;
                                    background-color: #f9eeee;
                                    border: 1px solid #ead0d0;
                                    border-radius: 10px;
                                "
                            >

                                <tr>
                                    <td
                                        style="
                                            padding: 18px 20px;
                                        "
                                    >

                                        <p
                                            style="
                                                margin: 0 0 12px;
                                                color: #691f1f;
                                                font-size: 14px;
                                                font-weight: bold;
                                            "
                                        >
                                            Application Information
                                        </p>


                                        <p
                                            style="
                                                margin: 6px 0;
                                                font-size: 14px;
                                                line-height: 1.6;
                                            "
                                        >
                                            <strong>
                                                Applicant Number:
                                            </strong>

                                            {{ $interviewee->applicant_number }}
                                        </p>


                                        <p
                                            style="
                                                margin: 6px 0;
                                                font-size: 14px;
                                                line-height: 1.6;
                                            "
                                        >
                                            <strong>
                                                Program:
                                            </strong>

                                            {{ $interviewee->program }}
                                        </p>


                                        @if (!empty($interviewee->academic_year))

                                            <p
                                                style="
                                                    margin: 6px 0;
                                                    font-size: 14px;
                                                    line-height: 1.6;
                                                "
                                            >
                                                <strong>
                                                    Academic Year:
                                                </strong>

                                                {{ $interviewee->academic_year }}
                                            </p>

                                        @endif

                                    </td>
                                </tr>

                            </table>


                            <p
                                style="
                                    margin: 0 0 18px;
                                    font-size: 15px;
                                    line-height: 1.8;
                                "
                            >
                                We appreciate the time and effort you invested
                                throughout the admission process.
                            </p>


                            <p
                                style="
                                    margin: 28px 0 0;
                                    font-size: 15px;
                                    line-height: 1.8;
                                "
                            >
                                Sincerely,<br>

                                <strong
                                    style="
                                        color: #691f1f;
                                    "
                                >
                                    USeP School of Law
                                </strong>
                            </p>

                        </td>
                    </tr>


                    <!-- FOOTER -->

                    <tr>
                        <td
                            style="
                                padding: 20px 30px;
                                background-color: #f8f8f8;
                                border-top: 1px solid #eeeeee;
                                text-align: center;
                            "
                        >

                            <p
                                style="
                                    margin: 0;
                                    color: #6b7280;
                                    font-size: 12px;
                                    line-height: 1.6;
                                "
                            >
                                This is an automated notification from the
                                USeP School of Law Admission Portal.
                            </p>

                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>

</html>
