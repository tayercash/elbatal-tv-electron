!function (root, factory) {
    if (typeof exports === "object" && typeof module === "object") {
        module.exports = factory(require("clappr"))
    } else if (typeof define === "function" && define.amd) {
        define(["clappr"], factory)
    } else if (typeof exports === "object") {
        exports.ContinueWatching = factory(require("clappr"))
    } else {
        root.ContinueWatching = factory(root.Clappr)
    }
}(typeof self !== "undefined" ? self : this, function (Clappr) {
    const { ContainerPlugin, Events } = Clappr

    class ContinueWatchingPlugin extends ContainerPlugin {
        get name() { return 'continue_watching' }
        static get version() { return '0.1.0-debug' }

        constructor(container) {
            super(container)
            console.log('[ContinueWatchingPlugin] constructor()')

            this._options = Object.assign({
                userId: null,              // 👈 المستخدم
                videoId: null,             // 👈 الفيديو
                apiUrl: 'https://my.elbatal-app.com/users/api/continue_watching.php',
                autoResume: true,
                showPrompt: false,
                minSeconds: 30,
                nearEndGap: 15,
                writeInterval: 10_000,
            }, (container.options && container.options.continueWatching) || {})

            // console.log('[ContinueWatchingPlugin] options:', this._options)

            this._lastSaved = 0
            this._bindEvents()
        }

        _bindEvents() {
            console.log('[ContinueWatchingPlugin] binding events…')
            this.listenTo(this.container, Events.CONTAINER_PLAY, this._onPlay)
            this.listenTo(this.container, Events.CONTAINER_TIMEUPDATE, this._onTimeUpdate)
            this.listenTo(this.container, Events.CONTAINER_ENDED, this._onEnded)
        }

        _onPlay = async () => {
            console.log('[ContinueWatchingPlugin] onPlay triggered')

            if (!this._options.userId || !this._options.videoId || !this._options.apiUrl) {
                console.warn("[ContinueWatching] Missing userId, videoId or apiUrl")
                return
            }
            if (this._resumedOnce) {
                console.log('[ContinueWatchingPlugin] already resumed once, skipping')
                return
            }

            try {
                const res = await fetch(`${this._options.apiUrl}?user_id=${encodeURIComponent(this._options.userId)}&video_id=${encodeURIComponent(this._options.videoId)}`)
                const data = await res.json()
                if (data.time && this._options.autoResume) {
                    this.container.seek(data.time)
                    console.log('[ContinueWatchingPlugin] resumed to', data.time)
                    this._resumedOnce = true
                }
            } catch (err) {
                console.error('[ContinueWatchingPlugin] error loading saved time:', err)
            }
        }

        _onTimeUpdate = () => {
            const pos = this.container.getCurrentTime()
            const dur = this.container.getDuration()
            const now = Date.now()

            if (now - this._lastSaved < this._options.writeInterval) return

            if (pos > this._options.minSeconds && dur - pos > this._options.nearEndGap) {
                this._saveProgress(pos)
                this._lastSaved = now
            }
        }

        _onEnded = () => {
            console.log('[ContinueWatchingPlugin] onEnded triggered, clearing position')
            this._saveProgress(0) // reset progress when video ends
            this._stopAutoSave()
        }
        _startAutoSave() {
            if (this._interval) clearInterval(this._interval)
            this._interval = setInterval(() => this._saveProgress(), 5000) // كل 5 ثواني
        }
        _stopAutoSave() {
            if (this._interval) {
                clearInterval(this._interval)
                this._interval = null
            }
        }

        async _saveProgress(forceTime = null) {
            if (!this._options.videoId || !this._options.userId) return

            const pos = forceTime !== null ? forceTime : this.container.getCurrentTime()
            const dur = this.container.getDuration()

            if (pos < this._options.minSeconds || dur - pos < this._options.nearEndGap) return

            try {
                await fetch(this._options.apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `user_id=${encodeURIComponent(this._options.userId)}&video_id=${encodeURIComponent(this._options.videoId)}&time=${encodeURIComponent(pos)}&duration=${encodeURIComponent(dur)}`
                })
                console.log('[ContinueWatchingPlugin] saved progress at', pos, 'of', dur)
            } catch (err) {
                console.error('[ContinueWatchingPlugin] save error:', err)
            }
        }
    }

    return ContinueWatchingPlugin
})
