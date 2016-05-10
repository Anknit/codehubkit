<?php
?>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
        <title>Wisdomtalkies Account Activation</title>
    </head>
    <body style="background:#fefefe;">
        <table cellpadding="0" cellspacing="0" style="width:100%; background-color:#fff; word-break: break-word; padding:20px; font-family:Arial, Helvetica, sans-serif; font-size:12px;" id="Table_01">
            <tr>
                <td>
                    Please click the link below to complete the registration with <a href="<?php echo getHttpRoot(); ?>" target="_blank">WisdomTalkies:</a>
                </td>
            </tr>
            <tr>
                <td height="15">
                    &nbsp;
                </td>
            </tr>
            <tr>
                <td style="word-break:break-all">
                    <a id="sign-up-link" href="<?php if(isset($mail_arguments) && isset($mail_arguments['mail_form_link'])){echo $mail_arguments['mail_form_link']; }?>" style="font-size:14px; text-decoration:none; color:#60ABE4;">
                        <?php if(isset($mail_arguments) && isset($mail_arguments['mail_form_link'])){echo $mail_arguments['mail_form_link']; }?>
                    </a>
                </td>
            </tr>
            <tr>
                <td height="15">
                    &nbsp;
                </td>
            </tr>
            <tr>
                <td>
                    If clicking does not work, please copy the link and paste it into web browser's address window. The corresponding page at WisdomTalkies will guide you through the registration process.
                </td>
            </tr>
            <tr>
                <td height="15">
                    &nbsp;
                </td>
            </tr>
            <tr>
                <td>
                    This link will expire in 15 days, please complete the activation process before link expiration.
                </td>
            </tr>
            <tr>
                <td height="15">
                    &nbsp;
                </td>
            </tr>
            <tr>
                <td>
                    Thanks for visiting WisdomTalkies.
                </td>
            </tr>
            <tr>
                <td height="5">
                    &nbsp;
                </td>
            </tr>
            <tr>
                <td>
                    <a href="<?php echo getHttpRoot(); ?>" target="_blank">
                        <img src="<?php echo getHttpRoot().projectFolderName.'/image/wisdomtalkies.png'; ?>" alt="WisdomTalkies" height="40px" width="160px" />
                    </a>
                </td>
            </tr>
        </table>
    </body>
</html>
	