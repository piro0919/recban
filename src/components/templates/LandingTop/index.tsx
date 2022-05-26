import Heading1 from "components/atoms/Heading1";
import Image from "next/image";
import { useRouter } from "next/router";
import { setCookie } from "nookies";
import { useMemo, CSSProperties, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { useBoolean, useWindowSize } from "usehooks-ts";
import styles from "./style.module.scss";

type SlideNextButtonProps = {
  isLastSlide: boolean;
};

function SlideNextButton({ isLastSlide }: SlideNextButtonProps): JSX.Element {
  const swiper = useSwiper();
  const router = useRouter();
  const handleClick = useCallback(() => {
    if (isLastSlide) {
      setCookie(null, "isFirstAccess", "false", {
        maxAge: 60 * 60 * 24 * 30 * 12 * 10,
        path: "/",
      });

      router.reload();

      return;
    }

    swiper.slideNext();
  }, [isLastSlide, router, swiper]);

  return <button className={styles.button} onClick={handleClick} />;
}

type LastSlideChildrenProps = {
  isActive: boolean;
  onIsLastSlide: () => void;
};

function LastSlideChildren({
  isActive,
  onIsLastSlide,
}: LastSlideChildrenProps): JSX.Element {
  useEffect(() => {
    if (!isActive) {
      return;
    }

    onIsLastSlide();
  }, [isActive, onIsLastSlide]);

  return (
    <>
      <Image
        alt=""
        className={styles.backgroundWrapper}
        layout="fill"
        objectFit="cover"
        quality={100}
        src="/images/background.png"
        unoptimized={true}
      />
      <div className={styles.imageWrapper}>
        <Image
          alt=""
          layout="fill"
          objectFit="contain"
          quality={100}
          src="/images/06.png"
          unoptimized={true}
        />
      </div>
      <div className={styles.messageWindowWrapper}>
        <div className={styles.messageWindow}>
          <p className={styles.message}>
            それでは！さっそく「りくばん！」を使ってみよう！
          </p>
        </div>
      </div>
    </>
  );
}

function LandingTop(): JSX.Element {
  const { height } = useWindowSize();
  const style = useMemo<CSSProperties>(
    () => ({ height: `${height}px` }),
    [height]
  );
  const { setTrue: onIsLastSlide, value: isLastSlide } = useBoolean(false);

  return (
    <Swiper lazy={{ loadPrevNext: true }} slidesPerView={1} spaceBetween={0}>
      <SwiperSlide className={styles.swiperSlide} style={style}>
        <Image
          alt=""
          className={styles.backgroundWrapper}
          layout="fill"
          objectFit="cover"
          quality={100}
          src="/images/background.png"
          unoptimized={true}
        />
        <div className={styles.imageWrapper}>
          <Image
            alt=""
            layout="fill"
            objectFit="contain"
            quality={100}
            src="/images/01.png"
            unoptimized={true}
          />
        </div>
        <div className={styles.messageWindowWrapper}>
          <div className={styles.messageWindow}>
            <p className={styles.message}>
              「りくばん！」を使って最高のバンドメンバーと出会おう！
            </p>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide className={styles.swiperSlide} style={style}>
        <Image
          alt=""
          className={styles.backgroundWrapper}
          layout="fill"
          objectFit="cover"
          quality={100}
          src="/images/background.png"
          unoptimized={true}
        />
        <div className={styles.imageWrapper}>
          <Image
            alt=""
            layout="fill"
            objectFit="contain"
            quality={100}
            src="/images/02.png"
            unoptimized={true}
          />
        </div>
        <div className={styles.messageWindowWrapper}>
          <div className={styles.messageWindow}>
            <p className={styles.message}>
              「りくばん！」の利用は完全に無料！誰でも簡単に使えるよ！
            </p>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide className={styles.swiperSlide} style={style}>
        <Image
          alt=""
          className={styles.backgroundWrapper}
          layout="fill"
          objectFit="cover"
          quality={100}
          src="/images/background.png"
          unoptimized={true}
        />
        <div className={styles.imageWrapper}>
          <Image
            alt=""
            layout="fill"
            objectFit="contain"
            quality={100}
            src="/images/03.png"
            unoptimized={true}
          />
        </div>
        <div className={styles.messageWindowWrapper}>
          <div className={styles.messageWindow}>
            <p className={styles.message}>hoge</p>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide className={styles.swiperSlide} style={style}>
        <Image
          alt=""
          className={styles.backgroundWrapper}
          layout="fill"
          objectFit="cover"
          quality={100}
          src="/images/background.png"
          unoptimized={true}
        />
        <div className={styles.imageWrapper}>
          <Image
            alt=""
            layout="fill"
            objectFit="contain"
            quality={100}
            src="/images/04.png"
            unoptimized={true}
          />
        </div>
        <div className={styles.messageWindowWrapper}>
          <div className={styles.messageWindow}>
            <p className={styles.message}>fuga</p>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide className={styles.swiperSlide} style={style}>
        <Image
          alt=""
          className={styles.backgroundWrapper}
          layout="fill"
          objectFit="cover"
          quality={100}
          src="/images/background.png"
          unoptimized={true}
        />
        <div className={styles.imageWrapper}>
          <Image
            alt=""
            layout="fill"
            objectFit="contain"
            quality={100}
            src="/images/05.png"
            unoptimized={true}
          />
        </div>
        <div className={styles.messageWindowWrapper}>
          <div className={styles.messageWindow}>
            <p className={styles.message}>piyo</p>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide className={styles.swiperSlide} style={style}>
        {({ isActive }): JSX.Element => (
          <LastSlideChildren
            isActive={isActive}
            onIsLastSlide={onIsLastSlide}
          />
        )}
      </SwiperSlide>
      <div className={styles.heading1Wrapper}>
        <Heading1 />
      </div>
      <div className={styles.buttonWrapper}>
        <SlideNextButton isLastSlide={isLastSlide} />
      </div>
    </Swiper>
  );
}

export default LandingTop;
