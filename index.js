module.exports = {
    createPages: async (client, message, embeds, duration, buttonStyle, rightEmoji, leftEmoji, cancelEmoji) => {
        if (!["red", "green", "blurple"].includes(buttonStyle)) throw new TypeError(`Button style provided is not valid.`);
        if (!rightEmoji) throw new TypeError(`An emoji to go to the next page was not provided.`);
        if (!leftEmoji) throw new TypeError(`An emoji to go to the previous page was not provided.`);
        if (!leftEmoji) throw new TypeError(`An emoji to go cancel the embed page was not provided.`);
        const { MessageButton, MessageActionRow } = require('discord-buttons');
        const buttonStartTime = Date.now();
        let currentPage = 0;
        const nextPageButton = new MessageButton()
            .setLabel("")
            .setStyle(buttonStyle)
            .setEmoji(rightEmoji)
            .setID('next-page');

        const backPageButton = new MessageButton()
            .setLabel("")
            .setStyle(buttonStyle)
            .setEmoji(leftEmoji)
            .setID('back-page');

        const deletePageButton = new MessageButton()
            .setLabel("")
            .setStyle(buttonStyle)
            .setEmoji(cancelEmoji)
            .setID('cancel-page');

        const interactivePages = new MessageActionRow()
            .addComponent(backPageButton)
            .addComponent(deletePageButton)
            .addComponent(nextPageButton);

        const msg = await message.channel.send({ components: [interactivePages], embed: embeds[0] });
        client.on('clickButton', async button => {
            if (message.author !== button.clicker.user || Date.now() - buttonStartTime >= duration || button.message.id !== msg.id) return;
            if (button.id == 'next-page') {
                (currentPage + 1 == embeds.length ? currentPage = 0 : currentPage += 1);
                msg.edit({ embed: embeds[currentPage], components: [interactivePages] });
                button.defer(true);
            } else if (button.id == 'back-page') {
                (currentPage - 1 < 0 ? currentPage = embeds.length -1 : currentPage -= 1);
                msg.edit({ embed: embeds[currentPage], components: [interactivePages] });
                button.defer(true);
            } else if (button.id == 'cancel-page') {
                await msg.delete()
                    .catch(err => console.error(err));
            }
        });
    },
};