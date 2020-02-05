(*  If variable is changed, concat and send message *)
IF RTC.SECONDS <> iSecondsRemembered THEN
    iSecondsRemembered              := RTC.SECONDS;
    strEventsMessage                := EncodeIntegerValue(RTC.SECONDS, '/rtc/seconds');
    xSendMessage                    := TRUE;
END_IF;

TcpClientInstance.xActivate         := xActivateTcpClient;
TcpClientInstance.xSend             := xSendMessage;
TcpClientInstance.strMessage        := strEventsMessage;
TcpClientInstance.strIpAddress      := strPlcIpAddress;
TcpClientInstance.uiPort            := UINT#3999;

TcpClientInstance();

xTcpClientError                     := TcpClientInstance.xError;
wTcpServerStatus                    := TcpClientInstance.wStatus;

IF TcpClientInstance.xErrorSend OR TcpClientInstance.xDoneSend THEN
    xSendMessage                    := FALSE;
END_IF;
