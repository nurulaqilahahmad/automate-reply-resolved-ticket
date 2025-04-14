const Imap = require('imap');
const {simpleParser} = require('mailparser');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const imapConfig = {
    user: 'aqilah@milradius.com.my',
    password: 'Qwerty@mrsb',
    host: 'imap-mail.outlook.com',
    port: 993,
    tls: true
};

const getEmails = () => {
    try {
        const imap = new Imap(imapConfig);

        imap.once('ready', () => {
            imap.openBox('INBOX', false, () => {
                imap.search(['UNSEEN', ['SINCE', new Date()]], (err, results) => {
                    const f = imap.fetch(results, {bodies: ''});
                    f.on('message', msg => {
                        msg.on('body', stream => {
                            simpleParser(stream, async(err, parsed) => {
                                console.log('==============================');
                                console.log('From' + parsed.from.text + ' -> ' + parsed.text);
                            });
                        });

                        msg.once('attribute', attr => {
                            const {uid} = attrs;
                            // imap.addFlags(uid, ['\\Seen'], () => {
                            //     console.log('Marked as read');
                            // });
                        });

                        f.once('error', ex => {
                            return Promise.reject(ex);
                        });

                        f.once('end', () => {
                            console.log('Done fetching all messages.');
                            imap.end();
                        })
                    });
                });
            });
        });

        imap.once('error', err => {
            console.log(err);
        });

        imap.once('end', () => {
            console.log('Connection ended.');
        });

        imap.connect();
    }
    catch(ex) {
        console.log('An error has been occurred while fetching the mails.');
    }
};

getEmails();