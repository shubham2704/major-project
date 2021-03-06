'use strict';

import { game } from './Game';
import { HUD_PAGE_U, HUD_PAGE_V, HUD_PAGE_TEXT_U, R90 } from './Constants';
import { clamp, vectorBetween, vectorAdd, vector2angle, uv2xy } from './Util';
import { Input } from './input/Input';
import { Sprite } from './Sprite';
import { Text } from './Text';
import { Viewport } from './Viewport';
import { ScreenShake } from './ScreenShake';
import { Victory } from './systems/Victory';

/**
 * Hud
 *
 * Health bars, ammo, etc.
 */
export const Hud = {
    draw() {
        // Health
        let hp = clamp(game.player.hp, 0, 100);
        Viewport.ctx.drawImage(Sprite.hud_healthbar[0].img, 2, 2);
        Viewport.ctx.drawImage(
            Sprite.hud_healthbar[1].img,
            0,
            0,
            hp + 8,
            8,
            2,
            2,
            hp + 8,
            8
        );

        // Shells
        let sprite = Sprite.hud_shells_full;
        for (let i = 0; i < game.player.shellsMax; i++) {
            if (i + 1 > game.player.shellsLeft)
                sprite = Sprite.hud_shells_empty;
            Viewport.ctx.drawImage(sprite.img, 15 + 6 * i, 10);
        }

        // Glyphs
        // Text.drawText(Viewport.ctx, 'stuvw', Viewport.width - HUD_PAGE_TEXT_U - 60, 4, 2, Text.blue, Text.blue_shadow);

        // Pages
        let pages = game.player.pages;
        if (game.victory) pages = Victory.frame > 240 ? 666 : 404;
        if (pages > 0 || game.player.deaths > 0) {
            if (Hud.pageGlow > 0 && Hud.pageGlow < 30) {
                Viewport.ctx.globalAlpha = 1 - (Hud.pageGlow++ / 60);
            } else {
                Viewport.ctx.globalAlpha = 0.5;
            }
            Viewport.ctx.drawImage(
                Sprite.page[1].img,
                Viewport.width - HUD_PAGE_U,
                HUD_PAGE_V
            );
            Viewport.ctx.globalAlpha = 1;
            Viewport.ctx.drawImage(
                Sprite.page[0].img,
                Viewport.width - HUD_PAGE_U,
                HUD_PAGE_V
            );
            Text.drawText(
                Viewport.ctx,
                'x' + ('' + pages).padStart(3, '0'),
                Viewport.width - HUD_PAGE_TEXT_U,
                4,
                2,
                pages === 666 ? Text.red : Text.blue,
                Text.blue_shadow
            );
        }

        Hud.drawPageArrow();

        // Debugging - viewport width/height
        /*
        Text.drawRightText(
            Viewport.ctx,
            [Viewport.scale, Viewport.width, Viewport.height, 'stuvwx'].join(', '),
            Viewport.width - 4,
            Viewport.height - 18
        );
        */

        if (Input.pointer) {
            if (game.dialog) {
                Viewport.ctx.globalAlpha = 0.5;
            }
            Sprite.drawViewportSprite(Sprite.hud_crosshair[0], uv2xy(Input.pointer), game.frame / 72);
            Viewport.ctx.globalAlpha = 1;
        }
    },

    drawPageArrow() {
        let page = Hud.closestPage();
        if (page) {
            let vector = vectorBetween(game.player.pos, page.pos);
            let angle = vector2angle(vector);
            vector.m = clamp(vector.m / 2, 16, Viewport.height / 2 - 5);
            if (vector.m > 64) {
                let xy = vectorAdd(game.player.pos, vector);
                let a = Math.sin(game.frame / 60)
                Viewport.ctx.globalAlpha = Math.sin(game.frame / 20) * 0.2 + 0.8;
                Sprite.drawViewportSprite(Sprite.page[2], xy, angle + R90);
                Viewport.ctx.globalAlpha = 1;
            }
        }
    },

    closestPage() {
        let pages = game.entities.filter(entity => entity.page);
        let pos = game.player.pos;
        pages.sort((a, b) => {
            let dist = ((a.pos.x - pos.x) ** 2 + (a.pos.y - pos.y) ** 2) - ((b.pos.x - pos.x) ** 2 + (b.pos.y - pos.y) ** 2);
            return dist;
        });
        return pages[0];
    }
};
