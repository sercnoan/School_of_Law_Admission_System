<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>
        Examination Result
    </title>
</head>

<body
    style="
        margin: 0;
        padding: 0;
        background-color: #f5f5f5;
        font-family: Arial, Helvetica, sans-serif;
        color: #333333;
    "
>

    <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
        style="
            padding: 30px 15px;
            background-color: #f5f5f5;
        "
    >

        <tr>
            <td align="center">

                <table
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    style="
                        max-width: 650px;
                        background-color: #ffffff;
                        border-radius: 12px;
                        overflow: hidden;
                        border: 1px solid #e5e7eb;
                    "
                >

                    <tr>
                        <td
                            style="
                                background-color: #691f1f;
                                padding: 28px;
                                text-align: center;
                                color: #ffffff;
                            "
                        >

                            <h1
                                style="
                                    margin: 0;
                                    font-size: 24px;
                                "
                            >
                                USeP School of Law
                            </h1>

                            <p
                                style="
                                    margin: 8px 0 0;
                                    color: #f5dada;
                                    font-size: 14px;
                                "
                            >
                                Admission Office
                            </p>

                        </td>
                    </tr>


                    <tr>

                        <td
                            style="
                                padding: 35px;
                            "
                        >

                            <h2
                                style="
                                    color: #15803d;
                                    margin-top: 0;
                                "
                            >
                                Congratulations!
                            </h2>


                            <p>
                                Dear
                                <strong>
                                    {{ $applicantName }}
                                </strong>,
                            </p>


                            <p
                                style="
                                    line-height: 1.7;
                                "
                            >
                                We are pleased to inform you that
                                you have
                                <strong>
                                    PASSED
                                </strong>
                                the USeP School of Law admission
                                examination.
                            </p>


                            <p
                                style="
                                    line-height: 1.7;
                                "
                            >
                                As the next step in the admission
                                process, you have been scheduled
                                for an interview.
                            </p>


                            <table
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                style="
                                    margin: 25px 0;
                                    background-color: #f9eeee;
                                    border: 1px solid #ead0d0;
                                    border-radius: 10px;
                                "
                            >

                                <tr>

                                    <td
                                        style="
                                            padding: 22px;
                                        "
                                    >

                                        <h3
                                            style="
                                                margin-top: 0;
                                                color: #691f1f;
                                            "
                                        >
                                            Interview Schedule
                                        </h3>


                                        <p>
                                            <strong>
                                                Date:
                                            </strong>

                                            {{ $interviewDate }}
                                        </p>


                                        <p>
                                            <strong>
                                                Time:
                                            </strong>

                                            {{ $interviewTime }}
                                        </p>


                                        <p>
                                            <strong>
                                                Venue:
                                            </strong>

                                            {{ $venue }}
                                        </p>


                                        @if($instructions)

                                            <p
                                                style="
                                                    margin-bottom: 0;
                                                "
                                            >
                                                <strong>
                                                    Instructions:
                                                </strong>

                                                {{ $instructions }}
                                            </p>

                                        @endif

                                    </td>

                                </tr>

                            </table>


                            <p
                                style="
                                    line-height: 1.7;
                                "
                            >
                                Please arrive on time and bring
                                any identification or documents
                                requested by the School of Law.
                            </p>


                            <p
                                style="
                                    margin-top: 30px;
                                    line-height: 1.7;
                                "
                            >
                                Regards,<br>

                                <strong>
                                    USeP School of Law
                                </strong><br>

                                Admissions Office
                            </p>

                        </td>

                    </tr>


                    <tr>

                        <td
                            style="
                                padding: 20px;
                                text-align: center;
                                background-color: #f9fafb;
                                color: #6b7280;
                                font-size: 12px;
                            "
                        >
                            This is an automated message from the
                            USeP School of Law Admission System.
                        </td>

                    </tr>

                </table>

            </td>
        </tr>

    </table>

</body>
</html>