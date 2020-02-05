TCP_SOCKET_INSTANCE.ACTIVATE        := xActivate;
TCP_SOCKET_INSTANCE.DEST_IP         := strIpAddress;
TCP_SOCKET_INSTANCE.DEST_PORT       := uiPort;
TCP_SOCKET_INSTANCE();

xError                              := TCP_SOCKET_INSTANCE.ERROR;
dwHandle                            := TCP_SOCKET_INSTANCE.HANDLE;
wStatus                             := TCP_SOCKET_INSTANCE.STATUS;

IF xSend THEN
    xBufResult := STRING_COPY(strMessage, arrSendData, 0, LEN(strMessage));
END_IF;

TCP_SEND_INSTANCE.REQ               := xSend;
TCP_SEND_INSTANCE.DATA              := arrSendData;
TCP_SEND_INSTANCE.DATA_CNT          := TO_UDINT(LEN(strMessage));
TCP_SEND_INSTANCE.HANDLE            := dwHandle;
TCP_SEND_INSTANCE();

xErrorSend                          := TCP_SEND_INSTANCE.ERROR;
xDoneSend                           := TCP_SEND_INSTANCE.DONE;
wStatusSend                         := TCP_SEND_INSTANCE.STATUS;

