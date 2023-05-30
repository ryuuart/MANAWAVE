import PlaybackObject from "@ouroboros/anim/PlaybackObject";

describe("player", () => {
    it("should call the playback hooks", async () => {
        class TestPlaybackObject extends PlaybackObject {
            testStatus: string = "";

            onStart() {
                this.testStatus = "CUSTOM START LOGIC";
            }

            onPause(): void {
                this.testStatus = "CUSTOM PAUSE LOGIC";
            }

            onPlay(): void {
                this.testStatus = "CUSTOM PLAY LOGIC";
            }

            onStop(): void {
                this.testStatus = "CUSTOM STOP LOGIC";
            }
        }

        const player = new TestPlaybackObject();

        player.start();

        expect(player.testStatus).toEqual("CUSTOM START LOGIC");

        player.pause();

        expect(player.testStatus).toEqual("CUSTOM PAUSE LOGIC");

        player.play();

        expect(player.testStatus).toEqual("CUSTOM PLAY LOGIC");

        player.stop();

        expect(player.testStatus).toEqual("CUSTOM STOP LOGIC");
    });

    it("should have proper control state throughout animation", async () => {
        class TestPlaybackObject extends PlaybackObject {}

        const player = new TestPlaybackObject();

        expect(player.status).toEqual({
            started: false,
            paused: false,
        });

        player.pause();

        expect(player.status).toEqual({
            started: false,
            paused: false,
        });

        player.start();

        expect(player.status).toEqual({
            started: true,
            paused: false,
        });

        player.pause();

        expect(player.status).toEqual({
            started: true,
            paused: true,
        });

        player.play();

        expect(player.status).toEqual({
            started: true,
            paused: false,
        });

        player.stop();

        expect(player.status).toEqual({
            started: false,
            paused: false,
        });

        player.pause();

        expect(player.status).toEqual({
            started: false,
            paused: false,
        });

        player.start();

        expect(player.status).toEqual({
            started: true,
            paused: false,
        });

        player.pause();
        player.stop();

        expect(player.status).toEqual({
            started: false,
            paused: false,
        });
    });
});
