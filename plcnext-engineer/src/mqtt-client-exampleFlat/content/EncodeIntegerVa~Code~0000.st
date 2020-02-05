EncodeIntegerValue  := CONCAT('', '{"topic":"');
EncodeIntegerValue  := CONCAT(EncodeIntegerValue, strTopic);
EncodeIntegerValue  := CONCAT(EncodeIntegerValue, '","value":');
EncodeIntegerValue  := CONCAT(EncodeIntegerValue, TO_STRING(iValue, '{0:d}'));
EncodeIntegerValue  := CONCAT(EncodeIntegerValue, '}');
