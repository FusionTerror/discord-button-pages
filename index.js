module.exports = async (msg, pages, emojiList = ['⬅️', '⏹️', '➡️'], timeout = 120000) => {
    const {
        MessageButton,
        MessageActionRow
    } = require('discord-buttons');

    if (!msg) throw new TypeError('Msg argument is not supplied')
    if (!pages) throw new TypeError('Pages argument is not supplied')

    let currentPage = 0;

    const next = new MessageButton()
        .setLabel("")
        .setStyle('blurple')
        .setEmoji(emojiList[2])
        .setID('next')

    const back = new MessageButton()
        .setLabel("")
        .setStyle('blurple')
        .setEmoji(emojiList[0])
        .setID('back')

    const del = new MessageButton()
        .setLabel("")
        .setStyle('red')
        .setEmoji(emojiList[1])
        .setID('del')

    const interactive = new MessageActionRow()
        .addComponent(back)
        .addComponent(del)
        .addComponent(next)

    const e = await msg.channel.send({
        component: interactive,
        embed: pages[0].setFooter(`Page ${currentPage + 1} / ${pages.length} • Pagination Expires In 120 Seconds`, msg.author.displayAvatarURL({
            dynamic: true
        }))
    })

    const filter = (button) => button.clicker.user.id === msg.author.id
    const collector = e.createButtonCollector(filter, {
        time: timeout
    })

    collector.on('collect', async (btn) => {
        switch (btn.id) {
            case 'back':
                currentPage = currentPage > 0 ? --currentPage : pages.length - 1;

                e.edit({
                    embed: pages[currentPage].setFooter(`Page ${currentPage + 1} / ${pages.length} • Pagination Expires In 120 Seconds`, msg.author.displayAvatarURL({
                        dynamic: true
                    })),
                    component: interactive
                })

                btn.defer(true)
                break;
            case 'del':
                const next1 = new MessageButton()
                    .setLabel("")
                    .setStyle('blurple')
                    .setEmoji(emojiList[2])
                    .setID('next')
                    .setDisabled()

                const back1 = new MessageButton()
                    .setLabel("")
                    .setStyle('blurple')
                    .setEmoji(emojiList[0])
                    .setID('back')
                    .setDisabled()

                const del1 = new MessageButton()
                    .setLabel("")
                    .setStyle('red')
                    .setEmoji(emojiList[1])
                    .setID('del')
                    .setDisabled()

                const interactive1 = new MessageActionRow()
                    .addComponent(back1)
                    .addComponent(del1)
                    .addComponent(next1)

                e.edit({
                    embed: pages[currentPage].setFooter(`Page ${currentPage + 1} / ${pages.length} • Pagination Expired`, msg.author.displayAvatarURL({
                        dynamic: true
                    })),
                    component: interactive1
                })

                btn.defer(true)
                break;
            case 'next':
                currentPage = currentPage + 1 < pages.length ? ++currentPage : 0;

                e.edit({
                    embed: pages[currentPage].setFooter(`Page ${currentPage + 1} / ${pages.length} • Pagination Expires In 120 Seconds`, msg.author.displayAvatarURL({
                        dynamic: true
                    })),
                    component: interactive
                })
                btn.defer(true)
                break;
        }
    })

    collector.on('end', (collected) => {
        const next2 = new MessageButton()
            .setLabel("")
            .setStyle('blurple')
            .setEmoji(emojiList[2])
            .setID('next')
            .setDisabled()

        const back2 = new MessageButton()
            .setLabel("")
            .setStyle('blurple')
            .setEmoji(emojiList[0])
            .setID('back')
            .setDisabled()

        const del2 = new MessageButton()
            .setLabel("")
            .setStyle('red')
            .setEmoji(emojiList[1])
            .setID('del')
            .setDisabled()

        const interactive1 = new MessageActionRow()
            .addComponent(back2)
            .addComponent(del2)
            .addComponent(next2)

        e.edit({
            embed: pages[currentPage].setFooter(`Page ${currentPage + 1} / ${pages.length} • Pagination Expired`, msg.author.displayAvatarURL({
                dynamic: true
            })),
            component: interactive1
        })
    })
}
