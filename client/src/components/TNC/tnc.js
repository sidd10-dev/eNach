import React from 'react'
import styles from './tnc.module.css'

function TNC(props) {
  return (
    <>
      <div className={styles.cont}>
        <div className={styles.tnccont}>
          <h1 className={styles.head}>Terms & Conditions</h1>
          <p className={styles.content}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi mattis, orci id viverra ullamcorper, sem risus ultricies odio, in placerat ante tortor sit amet nisi. Aliquam ut imperdiet felis, sit amet rutrum mauris. Duis lobortis odio in blandit pharetra. Aliquam facilisis pellentesque urna, ut vestibulum dui tempor ut. Quisque tortor lacus, pharetra ac enim nec, feugiat porta quam. Sed ac felis lobortis nibh commodo convallis. Nunc ac placerat lectus.
            Suspendisse feugiat, elit at tincidunt fringilla, arcu ipsum suscipit odio, id viverra sem metus sed lorem. Nam id placerat metus. Nulla et venenatis sem. Aenean ut lorem id quam faucibus sollicitudin. Duis ex sem, feugiat nec tortor hendrerit, rhoncus ullamcorper nisl. Donec blandit rutrum commodo. Suspendisse vitae tortor vel libero congue accumsan. Praesent ut metus sit amet metus tempus auctor in ut purus. Praesent auctor fermentum pellentesque. Nunc ullamcorper dictum nisl, eu vestibulum dolor condimentum tempus. Proin non mollis elit, id malesuada lacus. Donec ut condimentum metus.

            Mauris suscipit felis a odio pharetra lacinia. Sed fermentum eros sed sem eleifend consequat. Aliquam suscipit gravida est sit amet tristique. Quisque porta sem et urna suscipit, et ultrices nisi dignissim. Donec vulputate viverra nisl, id scelerisque ex mollis eu. Nulla in purus fermentum dolor tincidunt ornare. Praesent varius nec nisl non fermentum. Maecenas volutpat quam ut orci vulputate, ut consequat elit mattis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam dignissim magna elementum, eleifend lacus ac, auctor quam. Sed vitae turpis dolor. Pellentesque mattis augue ut consequat aliquet. Suspendisse in massa eu lectus fermentum vestibulum. Aenean facilisis feugiat dolor eu auctor. Duis et porta tellus. Maecenas nisi lacus, tempor non tellus sed, dignissim pellentesque augue.
            Phasellus vel commodo augue, eget ornare diam. Nulla neque eros, imperdiet eu dolor id, euismod consequat urna. Curabitur sodales vehicula lacus sed sodales. Quisque cursus pulvinar cursus. In finibus luctus venenatis. Nulla pellentesque egestas nulla quis varius. Morbi laoreet, mauris eget fringilla condimentum, arcu sem laoreet purus, a venenatis neque lacus in velit. Sed sit amet diam leo.
            In hac habitasse platea dictumst. Vestibulum nec turpis quis leo faucibus ultrices. Vestibulum vulputate sapien sed purus volutpat, et gravida massa pretium. Maecenas ac imperdiet neque. Nunc luctus auctor magna, non dignissim nisi fringilla in. Nunc bibendum lacinia nisi, quis facilisis dolor dictum eget. Pellentesque lacus enim, posuere ut nibh non, feugiat mattis quam. Sed rhoncus mi ut nisl auctor vehicula. Vestibulum lacinia ac ligula sed laoreet. In sagittis, nulla eu fermentum finibus, metus nunc suscipit leo, a aliquam mi augue id lorem. Nunc vestibulum sapien vitae fringilla pretium. Etiam sed accumsan risus, vel pulvinar sem. Nulla arcu lectus, condimentum quis ligula ac, ullamcorper lacinia purus. Praesent eget condimentum est, sed posuere magna. Praesent posuere sapien a erat luctus, sed ullamcorper erat fringilla. Donec a massa volutpat tellus dapibus sodales in nec enim.
          </p>
          <button className={styles.btn} onClick={props.onClick}>Accept and Continue</button>
        </div>
      </div>
    </>
  )
}

export default TNC