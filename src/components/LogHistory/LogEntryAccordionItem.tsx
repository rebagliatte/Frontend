import * as React from 'react';
import * as moment from 'moment';
import {
  AccordionItem,
  AccordionHeader,
  AccordionIcon,
  AccordionPanel,
  Box,
  IconButton,
  Flex
} from '@chakra-ui/core';
import ContactAvatar from '../ContactAvatar/ContactAvatar';

interface LogEntry {
  date: Date;
  contactWithUids: string[];
  deleteHandler: (uid: string) => void;
}
const LogEntryAccordionItem: React.FC<LogEntry> = ({
  date,
  contactWithUids,
  deleteHandler
}) => (
  <AccordionItem>
    <AccordionHeader>
      <Box flex="1" textAlign="left">
        {moment(date).format('ddd, DD MMM YYYY')}
      </Box>
      <AccordionIcon />
    </AccordionHeader>
    <AccordionPanel pb={4}>
      {contactWithUids.map((uid) => (
        <Flex key={uid} justifyContent="space-between">
          <ContactAvatar uid={uid} avatar={{ size: 'sm' }} />
          <IconButton
            variant="ghost"
            aria-label="Unlog contact"
            icon="small-close"
            onClick={() => deleteHandler(uid)}
          />
        </Flex>
      ))}
    </AccordionPanel>
  </AccordionItem>
);

export default LogEntryAccordionItem;
